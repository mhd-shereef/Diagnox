from __future__ import annotations

import logging
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import get_router as auth_router
from routes.ai_proxy import get_router as ai_proxy_router
from routes.cancer import get_router as cancer_router
from routes.cardio import get_router as cardio_router
from routes.diabetes import get_router as diabetes_router
from utils.predictor_service import PredictorService

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Healthcare AI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth routes ──
app.include_router(auth_router())

# ── AI proxy ──
app.include_router(ai_proxy_router())

# ── Prediction routes ──
try:
    predictor = PredictorService()
    app.include_router(cancer_router(predictor))
    app.include_router(diabetes_router(predictor))
    app.include_router(cardio_router(predictor))
    logger.info("All prediction models loaded successfully")
except Exception as e:
    logger.error(f"Failed to load prediction models: {e}")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "version": "2.0.0"}
