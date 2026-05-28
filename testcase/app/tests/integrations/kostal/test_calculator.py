# -*- coding: utf-8 -*-
import sys
from unittest.mock import MagicMock

# 1. ERST DIE MOCKS ERSTELLEN (Bevor irgendetwas anderes geladen wird!)
if "app.core.logging" not in sys.modules:
    mock_logging = MagicMock()
    mock_logging.setup_logger.return_value = MagicMock()
    sys.modules["app.core.logging"] = mock_logging

if "app.services.utillib" not in sys.modules:
    mock_util = MagicMock()
    mock_util.deep_get = lambda d, path, default=0.0, **kwargs: d.get(path.split('.')[-1], default) if isinstance(d, dict) else default
    sys.modules["app.services.utillib"] = mock_util

# 2. JETZT ERST DIE MODULE IMPORTIEREN
from datetime import datetime, timedelta, timezone
from app.integrations.kostal.models import GeneratorData
from app.integrations.kostal.calculator import PikoCalculator


def test_calculate_power_factors():
    # Simulierte Eingangsdaten für Phase 1 & 2 (Nutzt stringX_ampere statt output_lX_current)
    model = GeneratorData(
        output_l1_voltage=230.0, string1_ampere=5.0, l1_power=1150.0,  # cos phi = 1.0
        output_l2_voltage=230.0, string2_ampere=5.0, l2_power=575.0,   # cos phi = 0.5
        output_l3_voltage=0.0,   string3_ampere=0.0, l3_power=0.0      # cos phi = 0.0
    )

    result = PikoCalculator.calculate_power_factors(model)

    assert result.powerfactor_l1 == 1.0
    assert result.powerfactor_l2 == 0.5
    assert result.powerfactor_l3 == 0.0
    assert result.powerfactor == 0.75  # Durchschnitt aus Phase 1 & 2


def test_calculate_running_time():
    # 5 Tage, 2 Stunden, 10 Minuten und 30 Sekunden in der Vergangenheit
    installed = datetime.now(timezone.utc) - timedelta(days=5, hours=2, minutes=10, seconds=30)

    stats = PikoCalculator.calculate_running_time(installed)

    assert stats["days"] == 5
    assert "5 days, 2 hours, 10 minutes" in stats["running"]
