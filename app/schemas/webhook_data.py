# -*- coding: utf-8 -*-
"""Webhook-Schemas – definieren welche Felder an HA gesendet werden.

Jedes Feld im Schema = wird im Webhook-Payload ausgeliefert.
Kein Feld = wird nicht gesendet. Das Schema IST die Whitelist.
"""

from pydantic import BaseModel


class HeartbeatKPI(BaseModel):
    """KPI-Daten im Heartbeat (alle 60s)."""
    sensor_ok: bool = False
    current_power_w: float = 0.0
    power_day_kwh: float = 0.0
    power_month_kwh: float = 0.0
    power_year_kwh: float = 0.0
    mode: str = "unknown"


class DailySummary(BaseModel):
    """Zusammenfassung bei Tageswechsel."""
    power_day_kwh: float = 0.0
    power_month_kwh: float = 0.0
    power_year_kwh: float = 0.0


class MonthlySummary(BaseModel):
    """Zusammenfassung bei Monatswechsel."""
    power_month_kwh: float = 0.0
    power_year_kwh: float = 0.0
