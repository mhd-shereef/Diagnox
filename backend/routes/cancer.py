from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from schemas import CancerRequest, PredictionResponse
from utils.predictor_service import PredictorService

logger = logging.getLogger(__name__)


def get_router(predictor: PredictorService) -> APIRouter:
    router = APIRouter(prefix="/predict", tags=["cancer"])

    @router.post("/cancer", response_model=PredictionResponse)
    def predict_cancer(request: CancerRequest) -> PredictionResponse:
        try:
            payload = request.model_dump(by_alias=True)
            logger.info(f"Cancer prediction request received with {len(payload)} features")
            prediction, probability, top_features = predictor.predict_cancer(payload)
            logger.info(f"Cancer prediction: {prediction}, probability: {probability:.4f}")
            return PredictionResponse(
                prediction=prediction, probability=probability, top_features=top_features
            )
        except ValueError as e:
            logger.error(f"Validation error in cancer prediction: {e}")
            raise HTTPException(status_code=422, detail=f"Invalid input data: {str(e)}")
        except Exception as e:
            logger.error(f"Cancer prediction failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Prediction service error. Please try again.")

    return router
