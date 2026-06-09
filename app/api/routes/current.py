# app/api/current.py
import logging

from fastapi import APIRouter
from app.schemas.current import CurrentResponse
from app.services.current_service import CurrentService

logger = logging.getLogger(__name__)
router = APIRouter(tags=["current"])

@router.get("/current", response_model=CurrentResponse, response_model_exclude_none=True)
async def get_current_pv_data():
    """Liefert ausschließlich die aktuellen Live-Sensordaten des Wechselrichters."""
    service = CurrentService()
    return service.get_current_data()
