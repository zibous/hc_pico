# -*- coding: utf-8 -*-
from pydantic import BaseModel, Field
from typing import Optional

class AdvancedAnalytics(BaseModel):
    """NEU: Typsichere Struktur für die erweiterten Backend-Berechnungen."""
    total_dc_w: int = Field(default=0)
    inverter_efficiency_pct: float = Field(default=0.0)
    apparent_power_va: int = Field(default=0)
    reactive_power_var: int = Field(default=0)
    voltage_avg_v: float = Field(default=0.0)
    voltage_unbalance_pct: float = Field(default=0.0)
    co2_today_kg: float = Field(default=0.0)
    co2_total_kg: float = Field(default=0.0)
    trees_planted: int = Field(default=0)
    weather_factor_pct: int = Field(default=0)


class GeneratorData(BaseModel):
    """Vollständige Struktur für die Live-Werte des Wechselrichters."""
    status: str = Field(default="Offline")

    # AC-Spannungen und Leistungen
    output_l1_voltage: float = Field(default=0.0)
    output_l2_voltage: float = Field(default=0.0)
    output_l3_voltage: float = Field(default=0.0)

    l1_power: float = Field(default=0.0)
    l2_power: float = Field(default=0.0)
    l3_power: float = Field(default=0.0)

    # DC-Ströme der Strings (wichtig für die Leistungsfaktor-Näherung!)
    string1_ampere: float = Field(default=0.0)
    string2_ampere: float = Field(default=0.0)
    string3_ampere: float = Field(default=0.0)

    # Berechnete Felder (müssen veränderbar sein)
    powerfactor_l1: float = Field(default=0.0)
    powerfactor_l2: float = Field(default=0.0)
    powerfactor_l3: float = Field(default=0.0)
    powerfactor: float = Field(default=0.0)

    # =========================================================================
    # NEU: Diese beiden Felder erweitern Ihr API-Response-Modell
    # =========================================================================
    einspeisedauer_h: float = Field(default=0.0)
    analytics: AdvancedAnalytics = Field(default_factory=AdvancedAnalytics)

    # WICHTIG: Erlaubt dem Calculator das nachträgliche Beschreiben der Felder
    model_config = {
        "frozen": False,
        "populate_by_name": True
    }


class PanelConfig(BaseModel):
    """Nennleistung eines Panel-Strangs."""
    P_STC: float = Field(default=2500.0)


class PVConfig(BaseModel):
    """Globale Standort- und Hardwarekonfiguration."""
    latitude: float = Field(default=47.46)
    longitude: float = Field(default=9.62)
    timezone: str = Field(default="Europe/Vaduz")
    pv_ost: PanelConfig = Field(default_factory=PanelConfig)
    pv_west: PanelConfig = Field(default_factory=PanelConfig)


class PVModelParameters(BaseModel):
    """Feineinstellungs-Parameter aus der pv_model.json."""
    exponent: float = Field(default=1.8)
    peak_scale: float = Field(default=1.2)
    shift_ost: float = Field(default=-0.15)
    shift_west: float = Field(default=0.15)
    ost_weight: float = Field(default=0.5)
    west_weight: float = Field(default=0.5)
    eta: float = Field(default=0.91)


class HistoryMetrics(BaseModel):
    """Struktur für die history.json."""
    power_day: float = Field(default=0.0)
    power_hour: float = Field(default=0.0)
    power_week: float = Field(default=0.0)
    power_month: float = Field(default=0.0)
    power_year: float = Field(default=0.0)
    last_update: Optional[str] = Field(default=None)
