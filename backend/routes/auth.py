from __future__ import annotations

import json
import hashlib
import hmac
import os
import time
from pathlib import Path
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, Field, EmailStr


# ── Models ──────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    fullName: str = Field(..., min_length=1)
    dob: str = ""
    gender: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    token: str
    user: dict


class UserResponse(BaseModel):
    user: dict


# ── Helpers ──────────────────────────────────────────────────

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
USERS_FILE = DATA_DIR / "users.json"
JWT_SECRET = os.environ.get("JWT_SECRET", "diagnox-dev-secret-change-in-prod")


def _ensure_data_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not USERS_FILE.exists():
        USERS_FILE.write_text("[]", encoding="utf-8")


def _load_users() -> list[dict]:
    _ensure_data_dir()
    return json.loads(USERS_FILE.read_text(encoding="utf-8"))


def _save_users(users: list[dict]):
    _ensure_data_dir()
    USERS_FILE.write_text(json.dumps(users, indent=2), encoding="utf-8")


def _hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000).hex()
    return f"{salt}:{hashed}"


def _verify_password(password: str, stored: str) -> bool:
    salt, hashed = stored.split(":")
    check = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000).hex()
    return hmac.compare_digest(hashed, check)


def _create_token(user_data: dict) -> str:
    """Simple JWT-like token: base64(header).base64(payload).signature"""
    import base64
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
    payload_data = {
        "sub": user_data["email"],
        "role": user_data["role"],
        "name": user_data["name"],
        "iat": int(time.time()),
        "exp": int(time.time()) + 86400 * 7,  # 7 days
    }
    payload = base64.urlsafe_b64encode(json.dumps(payload_data).encode()).decode().rstrip("=")
    sig_input = f"{header}.{payload}"
    signature = hmac.new(JWT_SECRET.encode(), sig_input.encode(), hashlib.sha256).hexdigest()
    return f"{header}.{payload}.{signature}"


def _decode_token(token: str) -> dict | None:
    import base64
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header, payload, signature = parts
        sig_input = f"{header}.{payload}"
        expected_sig = hmac.new(JWT_SECRET.encode(), sig_input.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected_sig):
            return None
        # Pad base64
        padding = 4 - len(payload) % 4
        payload += "=" * padding
        data = json.loads(base64.urlsafe_b64decode(payload))
        if data.get("exp", 0) < time.time():
            return None
        return data
    except Exception:
        return None


def _get_user_from_token(authorization: str = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    data = _decode_token(token)
    if not data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return data


def _user_to_public(user: dict) -> dict:
    """Strip password hash from user dict before sending to client."""
    return {k: v for k, v in user.items() if k != "password_hash"}


ADMIN_EMAILS = {"admin@diagnox.ai"}


def _seed_users():
    """Create default admin and patient accounts if they don't exist."""
    users = _load_users()
    
    # Seed Admin
    if not any(u.get("role") == "admin" for u in users):
        admin = {
            "id": len(users) + 1,
            "email": "admin@diagnox.ai",
            "password_hash": _hash_password("admin123"),
            "name": "System Admin",
            "role": "admin",
            "dob": "",
            "gender": "",
            "bloodGroup": "",
            "phone": "",
            "address": "",
            "created_at": datetime.utcnow().isoformat(),
        }
        users.append(admin)
        
    # Seed Patient Demo
    if not any(u.get("email") == "test@diagnox.ai" for u in users):
        patient = {
            "id": len(users) + 1,
            "email": "test@diagnox.ai",
            "password_hash": _hash_password("Test123!"),
            "name": "Demo Patient",
            "role": "patient",
            "dob": "1980-01-01",
            "gender": "Male",
            "bloodGroup": "O+",
            "phone": "555-0199",
            "address": "123 Health Ave, Medical City",
            "created_at": datetime.utcnow().isoformat(),
        }
        users.append(patient)

    _save_users(users)


# ── Router ──────────────────────────────────────────────────

def get_router() -> APIRouter:
    _seed_users()
    router = APIRouter(prefix="/auth", tags=["auth"])

    @router.post("/register", response_model=AuthResponse)
    def register(request: RegisterRequest):
        users = _load_users()

        # Check existing
        if any(u["email"].lower() == request.email.lower() for u in users):
            raise HTTPException(status_code=400, detail="Email already registered")

        role = "admin" if request.email.lower() in ADMIN_EMAILS else "patient"
        new_user = {
            "id": len(users) + 1,
            "email": request.email.lower(),
            "password_hash": _hash_password(request.password),
            "name": request.fullName,
            "role": role,
            "dob": request.dob,
            "gender": request.gender,
            "bloodGroup": "",
            "phone": "",
            "address": "",
            "created_at": datetime.utcnow().isoformat(),
        }
        users.append(new_user)
        _save_users(users)

        token = _create_token(new_user)
        return AuthResponse(token=token, user=_user_to_public(new_user))

    @router.post("/login", response_model=AuthResponse)
    def login(request: LoginRequest):
        users = _load_users()
        user = next((u for u in users if u["email"].lower() == request.email.lower()), None)

        if not user or not _verify_password(request.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = _create_token(user)
        return AuthResponse(token=token, user=_user_to_public(user))

    @router.get("/me", response_model=UserResponse)
    def get_me(token_data: dict = Depends(_get_user_from_token)):
        users = _load_users()
        user = next((u for u in users if u["email"].lower() == token_data["sub"].lower()), None)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserResponse(user=_user_to_public(user))

    @router.put("/profile")
    def update_profile(updates: dict, token_data: dict = Depends(_get_user_from_token)):
        users = _load_users()
        for i, u in enumerate(users):
            if u["email"].lower() == token_data["sub"].lower():
                safe_keys = {"name", "bloodGroup", "phone", "gender", "address", "dob"}
                for k, v in updates.items():
                    if k in safe_keys:
                        users[i][k] = v
                _save_users(users)
                return {"user": _user_to_public(users[i])}
        raise HTTPException(status_code=404, detail="User not found")

    return router
