# app/api/current.py
import logging
from fastapi import APIRouter

from app.schemas.summary import SummaryResponse
from app.services.summary_service import SummaryService

logger = logging.getLogger(__name__)

# Der Router verwaltet die Kern-PV-Routen
router = APIRouter(tags=["pv-data"])

@router.get("/summary", response_model=SummaryResponse)
async def get_summary_pv_data():
    """Liefert aggregierte historische PV-Ertragsdaten (Tag, Woche, Monat, Jahr)."""
    logger.info("Historische Zusammenfassung (summary) angefordert.")
    service = SummaryService()
    return service.get_summary_data()
