# app/schemas/chart.py
from pydantic import BaseModel
from typing import List, Optional

class ChartResponse(BaseModel):
    # SystemMeta / meta_data entfernt, da diese nun zentral im DashboardService sitzen!
    period_type: str
    labels: List[str]
    values: List[float]
    total_kwh: float
    count: int

    # Optionale Felder, die nur im "hour"-Modus mitgeliefert werden
    theoretical: Optional[List[float]] = None
    efficiency: Optional[List[Optional[float]]] = None
    theo_daily_kwh: Optional[float] = None
    theo_so_far: Optional[float] = None
