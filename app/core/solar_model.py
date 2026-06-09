# app/core/solar_model.py
import math
from datetime import datetime, timedelta

def calc_theoretical_day(date_str: str, KOSTAL_SENSOR: dict, PV_ETA: float, PV_SHIFT_OST: float, PV_SHIFT_WEST: float) -> dict:
    """Berechnet die theoretische PV-Leistung basierend auf dem Sonnenstand."""
    try:
        import zoneinfo
        tz = zoneinfo.ZoneInfo(KOSTAL_SENSOR.get("timezone", "Europe/Vaduz"))
    except Exception:
        from datetime import timezone as _tz
        tz = _tz(timedelta(hours=2))

    d = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=tz)
    tz_offset_h = d.utcoffset().total_seconds() / 3600 if d.utcoffset() else 2.0
    day_of_year = d.timetuple().tm_yday

    lat = float(KOSTAL_SENSOR.get("latitude", 47.46))
    pv_ost_kw = float(KOSTAL_SENSOR.get("pv_ost", {}).get("P_STC", 2500)) * 0.001
    pv_west_kw = float(KOSTAL_SENSOR.get("pv_west", {}).get("P_STC", 2500)) * 0.001

    decl = 23.44 * math.sin(math.radians((360 / 365) * (day_of_year - 81)))
    cos_ha = max(-1.0, min(1.0, -math.tan(math.radians(lat)) * math.tan(math.radians(decl))))
    sunrise_h = 12.0 - math.degrees(math.acos(cos_ha)) / 15.0 + tz_offset_h
    daylight_h = max(0.01, (12.0 + math.degrees(math.acos(cos_ha)) / 15.0 + tz_offset_h) - sunrise_h)

    def p_at_hour(h_decimal):
        total = 0.0
        for s in range(6):
            t_norm = ((h_decimal + (s * 10 + 5) / 60.0) - sunrise_h) / daylight_h
            p_ost = pv_ost_kw * (math.sin(math.pi * (t_norm + PV_SHIFT_OST / daylight_h)) if 0 < (t_norm + PV_SHIFT_OST / daylight_h) < 1 else 0.0)
            p_west = pv_west_kw * (math.sin(math.pi * (t_norm + PV_SHIFT_WEST / daylight_h)) if 0 < (t_norm + PV_SHIFT_WEST / daylight_h) < 1 else 0.0)
            total += (p_ost + p_west) * PV_ETA
        return round(total / 6, 3)

    hourly_kw = [p_at_hour(h + 0.5) for h in range(24)]
    return {"hourly_kw": hourly_kw, "daily_kwh": round(sum(hourly_kw), 2)}
