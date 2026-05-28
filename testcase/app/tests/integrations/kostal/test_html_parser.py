# -*- coding: utf-8 -*-
import sys
import os
from unittest.mock import MagicMock

# 1. ERST DIE MOCKS ERSTELLEN (Bevor irgendetwas anderes geladen wird!)
if "app.core.logging" not in sys.modules:
    sys.modules["app.core.logging"] = MagicMock()
if "app.services.utillib" not in sys.modules:
    sys.modules["app.services.utillib"] = MagicMock()

# 2. JETZT DIE PIKO-MODULE IMPORTIEREN
from app.integrations.kostal.html_parser import PikoHtmlParser


def test_html_parsing_with_real_files():
    """Versucht deine echten HTML-Dateien aus dem Hauptordner einzulesen und zu testen."""
    # Pfad zu deinem Hauptverzeichnis ermitteln (wo kostal.html liegt)
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
    file1_path = os.path.join(base_dir, "kostal.html")
    file2_path = os.path.join(base_dir, "kostal2.html")

    # Test für die erste Datei (Laufender Betrieb)
    if os.path.exists(file1_path):
        with open(file1_path, "r", encoding="iso-8859-1") as f:
            html_content = f.read()
        parsed = PikoHtmlParser.parse_inverter_page(html_content)
        assert parsed["daily_energy"] == 17.19
        assert parsed["generator"]["status"] == "Einspeisen MPP"
        assert parsed["generator"]["l1_power"] == 929.0
        assert parsed["generator"]["string2_ampere"] == 5.76

    # Test für die zweite Datei (Standby / Aus)
    if os.path.exists(file2_path):
        with open(file2_path, "r", encoding="iso-8859-1") as f:
            html_content = f.read()
        parsed = PikoHtmlParser.parse_inverter_page(html_content)
        assert parsed["generator"]["status"] == "Aus"
        assert parsed["daily_energy"] == 21.39
        assert parsed["generator"]["l1_power"] == 0.0


def test_html_parsing_fallback_aus():
    """Sicherheits-Fallback Test mit dem originalen Standby-HTML."""
    offline_html = """<!DOCtype HTML PUBLIC "-//W3C//Dtd HTML 4.0 Transitional//EN">
<html>
<head><title>PV Webserver</title></head>
<body>
<form>
<table cellspacing="0" cellpadding="0" width="770">
<tr>
<td width="100">aktuell</td>
<td width="70" align="right" bgcolor="#FFFFFF">x x x&nbsp</td>
<td width="100">Gesamtenergie</td>
<td width="70" align="right" bgcolor="#FFFFFF">39200</td>
</tr>
<tr>
<td width="100">Tagesenergie</td>
<td width="70" align="right" bgcolor="#FFFFFF">21.39</td>
</tr>
<tr>
<td width="100">Status</td>
<td colspan="4">Aus</td>
</tr>
</table>
</form>
</body>
</html>"""

    parsed_data = PikoHtmlParser.parse_inverter_page(offline_html)
    assert parsed_data["generator"]["status"] == "Aus"
    assert parsed_data["daily_energy"] == 21.39
    assert parsed_data["generator"]["l1_power"] == 0.0
