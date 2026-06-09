# app/schemas/summary.py
from pydantic import BaseModel
from typing import List, Optional

class YearSummary(BaseModel):
    year: str
    kwh: float
    partial: Optional[bool] = None
    prev_same_period: Optional[float] = None

# 🌟 GEFIXT: Kurze Feldnamen passend zum neuen SummaryService
class PeriodMetrics(BaseModel):
    kwh: float
    co2_kg: float
    trees: float
    car_km: float

# 🌟 GEFIXT: Geschachtelte Kaskade für die Zeiträume
class EnvironmentalSummary(BaseModel):
    today: PeriodMetrics
    week: PeriodMetrics
    month: PeriodMetrics
    year: PeriodMetrics

class SummaryResponse(BaseModel):
    # SystemMeta / meta_data entfernt, da diese nun im DashboardService sitzen!
    today_kwh: float
    week_kwh: float
    month_kwh: float
    year_kwh: float
    years: List[YearSummary]

    # 🌟 GEFIXT: Nutzt jetzt den ultrakurzen Key "env"
    env: EnvironmentalSummary
    last_update: str
