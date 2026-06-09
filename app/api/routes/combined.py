# app/api/routes/combined.py
import logging
from fastapi import APIRouter, Request, HTTPException, status
from app.schemas.dashboard import DashboardCombinedResponse
from app.services.dashboard_service import DashboardService

logger = logging.getLogger(__name__)
router = APIRouter(tags=["combined"])

# all in one
# http://localhost:5098/api/combined/hour?date=2026-06-08
# http://localhost:5098/api/combined/week
# http://localhost:5098/api/combined/day
# http://localhost:5098/api/combined/month
# http://localhost:5098/api/combined/year
# http://localhost:5098/api/combined/month?from=2013-01&to=2026-06

@router.get("/combined/{period_type}", response_model=DashboardCombinedResponse, response_model_exclude_none=True)
async def get_combined_data(period_type: str, request: Request):
    """Universeller Aggregations-Endpoint (BFF-Pattern).
    Bündelt /current, /summary und das jeweilige /chart/{period_type}.
    """
    if period_type not in ("hour", "day", "week", "month", "year"):
        logger.warning(f"Ungültiger kombinierter Typ angefordert: {period_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ungültiger Typ. Erlaubt sind: hour, day, week, month, year"
        )

    service = DashboardService()
    # Extrahiert alle Parameter (?date=..., ?from=..., ?to=...) dynamisch als Dict
    query_params = dict(request.query_params)

    return service.get_all_dashboard_data(period_type, query_params)
