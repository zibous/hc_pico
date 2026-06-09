# app/api/routes/chart.py
import logging
from fastapi import APIRouter, Request, HTTPException, status
from app.schemas.chart import ChartResponse
from app.services.chart_service import ChartService

logger = logging.getLogger(__name__)
router = APIRouter(tags=["chart"])

@router.get("/chart/{period_type}", response_model=ChartResponse, response_model_exclude_none=True)
async def get_chart_data(period_type: str, request: Request):
    """Liefert dynamische Diagrammdaten (hour, day, week, month, year) inklusive Performance-Vergleichen."""
    if period_type not in ("hour", "day", "week", "month", "year"):
        logger.warning(f"Ungültiger Diagrammtyp angefordert: {period_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ungültiger Typ. Erlaubt sind: hour, day, week, month, year"
        )

    service = ChartService()
    # Wandelt die Query-Parameter in ein einfaches Dictionary um
    query_params = dict(request.query_params)
    return service.get_chart_data(period_type, query_params)
