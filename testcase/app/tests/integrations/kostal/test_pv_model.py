# -*- coding: utf-8 -*-
import sys
from unittest.mock import MagicMock

# 1. ERST DIE MOCKS ERSTELLEN (Bevor irgendetwas anderes geladen wird!)
if "app.core.logging" not in sys.modules:
    sys.modules["app.core.logging"] = MagicMock()
if "app.services.utillib" not in sys.modules:
    sys.modules["app.services.utillib"] = MagicMock()

# 2. JETZT DIE PIKO-MODULE IMPORTIEREN
from app.integrations.kostal.pv_model import PikoPVModel


def test_pv_model_structure():
    """Überprüft die mathematische Gültigkeit der Struktur des PV-Modells."""
    config = {
        "latitude": 47.46,
        "longitude": 9.62,
        "timezone": "Europe/Vaduz",
        "pv_ost": {"P_STC": 2500},
        "pv_west": {"P_STC": 2500}
    }

    class DummyLogger:
        def warning(self, msg, *args): pass
        def error(self, msg, *args): pass

    model = PikoPVModel(config, DummyLogger())
    stats = model.calculate_theoretical_power()

    # Validierung aller physikalischen Schlüssel im Rückgabe-Dictionary
    assert "total" in stats
    assert "pv_ost" in stats
    assert "pv_west" in stats
    assert "solar_time" in stats
    assert "solar_factor_ost" in stats
    assert "solar_factor_west" in stats
    assert "energy_ost_kwh" in stats
    assert "energy_west_kwh" in stats
    assert "energy_total_kwh" in stats
