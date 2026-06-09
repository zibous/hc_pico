# app/schemas/current.py
from pydantic import BaseModel
from typing import Optional, List

class ShortStrings(BaseModel):
    ost_w: float
    west_w: float
    share_ost_pct: float
    share_west_pct: float

class ShortSpecificYield(BaseModel):
    today_kwh_per_kwp: float = 0.0  # Optionaler Fallback
    historical_total_kwh_per_kwp: float = 0.0

class ShortPerf(BaseModel):
    utilization_pct: float
    specific_yield_total: float
    specific_yield_today: float
    strings: ShortStrings

class ShortEnv(BaseModel):
    co2_kg: float
    co2_tons: float
    trees: float
    car_km: float

class ShortWr(BaseModel):
    dc_total_w: float
    efficiency_pct: float
    loss_w: float

class ShortGrid(BaseModel):
    imbalance_w: float
    status: str
    apparent_va: float
    reactive_var: float

class CurrentResponse(BaseModel):
    timestamp: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    aktiv: Optional[int | str] = None
    mode: Optional[str] = None
    current_power_w: Optional[float] = None
    current_power_kw: Optional[float] = None
    daily_energy_kwh: Optional[float] = None
    total_energy_kwh: Optional[float] = None
    pv_ost_w: Optional[float] = None
    pv_west_w: Optional[float] = None
    pv_theoretical_kw: Optional[float] = None
    gesamtleistung_w: Optional[float] = None
    l1_voltage: Optional[float] = None
    l1_ampere: Optional[float] = None
    l1_power: Optional[float] = None
    string1_voltage: Optional[float] = None
    l2_voltage: Optional[float] = None
    l2_ampere: Optional[float] = None
    l2_power: Optional[float] = None
    string2_voltage: Optional[float] = None
    l3_voltage: Optional[float] = None
    l3_ampere: Optional[float] = None
    l3_power: Optional[float] = None
    powerfactor: Optional[float] = None

    # Die neuen, ultrakurzen Analyse-Klassen
    perf: Optional[ShortPerf] = None
    env: Optional[ShortEnv] = None
    wr: Optional[ShortWr] = None
    grid: Optional[ShortGrid] = None
