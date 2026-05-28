# -*- coding: utf-8 -*-
import sys
from unittest.mock import MagicMock

# 1. ERST DIE MOCKS ERSTELLEN (Bevor irgendetwas anderes geladen wird!)
if "app.core.logging" not in sys.modules:
    sys.modules["app.core.logging"] = MagicMock()
if "app.services.utillib" not in sys.modules:
    sys.modules["app.services.utillib"] = MagicMock()

# 2. JETZT DIE PIKO-MODULE IMPORTIEREN
from datetime import datetime, timedelta
from app.integrations.kostal.sensor import PikoSensor


def test_piko_sensor_integration_with_raw_inverter_data(tmp_path):
    """
    Simuliert den exakten Ablauf, wenn der Kostal Piko
    rohe String-Werte liefert.
    """

    # KORREKTUR: timezone.utc nutzen, damit int(days) nicht durch den UTC-Offset abgerundet wird!
    from datetime import timezone as tz
    config = {
        "historyfile": str(tmp_path / "history.json"),
        "max_delta_kwh": 2.0,
        "installed": datetime.now(tz.utc) - timedelta(days=10),
        "latitude": 47.46,
        "longitude": 9.62,
        "timezone": "Europe/Vaduz"
    }


    # 2. Rohe Datenstruktur, wie sie vom Kostal Piko ausgelesen wird.
    # WICHTIG: Die Werte sind hier Strings (Texte), genau wie beim echten Auslesen!
    raw_inverter_data = {
        "generator": {
            "status": "Einspeisen MPP",
            "output_l1_voltage": "230.0",
            "string1_ampere": "4.5",       # Ersetzt output_l1_current für den Leistungsfaktor
            "l1_power": "1035.0",

            "output_l2_voltage": "230.0",
            "string2_ampere": "0.0",
            "l2_power": "0.0",

            "output_l3_voltage": "230.0",
            "string3_ampere": "0.0",
            "l3_power": "0.0"
        }
    }

    # 3. Sensor-Koordinator initialisieren
    sensor = PikoSensor(config=config, data=raw_inverter_data)

    # 4. Daten verarbeiten (simulierter Messwert: 1.25 kWh Tagesenergie)
    result = sensor.process_data(current_daily_energy=1.25)

    # ==========================================
    # DIE VERIFIKATION (Das "Zeugenverhör")
    # ==========================================

    # Prüfen, ob der Status korrekt gesetzt wurde
    assert sensor.status == "Einspeisen MPP"
    assert sensor.dataready is True

    # Prüfen, ob Pydantic die Typkonvertierung von String zu Float gerockt hat
    # Der Leistungsfaktor für Phase 1 muss exakt 1.0 sein (1035W / (230V * 4.5A))
    assert result["live_data"]["generator"]["powerfactor_l1"] == 1.0
    assert result["live_data"]["generator"]["powerfactor"] == 1.0

    # Prüfen, ob die Laufzeit korrekt berechnet wurde (10 Tage installiert)
    assert result["runtime"]["days"] == 10
    assert "10 days" in result["runtime"]["running"]

    # Prüfen, ob das physikalische PV-Modell Werte liefert
    assert "total" in result["theoretical_pv"]
    assert "energy_total_kwh" in result["theoretical_pv"]

    # Prüfen, ob die Historie mit dem gelieferten Tageswert (1.25 kWh) gefüllt wurde
    assert result["history"]["power_day"] == 1.25
    assert result["history"]["power_hour"] == 1.25
