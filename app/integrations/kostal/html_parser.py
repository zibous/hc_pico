# -*- coding: utf-8 -*-
"""
HTML-Parser für den Kostal Piko Wechselrichter.

Parst das klassische Kostal-Piko-HTML und fängt 'x x x' im Standby sicher ab.
"""

from lxml import html


class PikoHtmlParser:
    @staticmethod
    def parse_inverter_page(html_content: bytes | str) -> dict:
        """Parst das klassische Kostal-Piko-HTML und gibt strukturierte Daten zurück."""
        tree = html.fromstring(html_content)

        def get_value_by_td(index: int) -> float:
            try:
                elements = tree.xpath('//td[@bgcolor="#FFFFFF"]')
                if index < len(elements):
                    text = elements[index].text
                    if not text:
                        return 0.0

                    text = text.strip()
                    # Sonderfall: WR im Standby liefert 'x x x'
                    if "x" in text or "X" in text:
                        return 0.0

                    return float(text)
                return 0.0
            except (ValueError, TypeError, IndexError):
                return 0.0

        # Status-Text auslesen
        try:
            status_elements = tree.xpath("//td[@colspan='4']")
            status_text = status_elements[0].text.strip() if status_elements and status_elements[0].text else "Unknown"
        except Exception:
            status_text = "Offline"

        return {
            "current_power": get_value_by_td(0),
            "total_energy": get_value_by_td(1),
            "daily_energy": get_value_by_td(2),
            "status": status_text,
            "generator": {
                "string1_voltage": get_value_by_td(3),
                "output_l1_voltage": get_value_by_td(4),
                "string1_ampere": get_value_by_td(5),
                "l1_power": get_value_by_td(6),
                "string2_voltage": get_value_by_td(7),
                "output_l2_voltage": get_value_by_td(8),
                "string2_ampere": get_value_by_td(9),
                "l2_power": get_value_by_td(10),
                "string3_voltage": get_value_by_td(11),
                "output_l3_voltage": get_value_by_td(12),
                "string3_ampere": get_value_by_td(13),
                "l3_power": get_value_by_td(14),
            },
        }
