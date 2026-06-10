from __future__ import annotations

import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


class ChatRequest(BaseModel):
    messages: list[dict]
    model: str = "gpt-oss:120b"
    stream: bool = False


class ChatResponse(BaseModel):
    content: str


AI_API_KEY = os.environ.get("AI_API_KEY", "")
AI_BASE_URL = os.environ.get("AI_BASE_URL", "https://ollama.com/api/chat")


def get_router() -> APIRouter:
    router = APIRouter(prefix="/api", tags=["ai"])

    @router.post("/chat", response_model=ChatResponse)
    async def ai_chat(request: ChatRequest):
        if not AI_API_KEY:
            raise HTTPException(status_code=503, detail="AI service not configured")

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    AI_BASE_URL,
                    json={
                        "model": request.model,
                        "messages": request.messages,
                        "stream": False,
                    },
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {AI_API_KEY}",
                    },
                )

                if response.status_code != 200:
                    raise HTTPException(
                        status_code=502,
                        detail=f"AI service returned {response.status_code}",
                    )

                data = response.json()
                content = (
                    data.get("message", {}).get("content")
                    or data.get("choices", [{}])[0].get("message", {}).get("content")
                    or "I couldn't generate a response."
                )
                return ChatResponse(content=content)

        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="AI service timed out")
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail=f"AI service error: {str(exc)}")

    return router
