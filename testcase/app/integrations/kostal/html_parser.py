# -*- coding: utf-8 -*-
from lxml import html

class PikoHtmlParser:
    @staticmethod
    def parse_inverter_page(html_content: str) -> dict:
        """Parst das klassische Kostal-Piko-HTML und fängt 'x x x' im Standby sicher ab."""
        tree = html.fromstring(html_content)

        def get_value_by_td(index: int) -> float:
            try:
                elements = tree.xpath('//td[@bgcolor="#FFFFFF"]')
                if index < len(elements):
                    text = elements[index].text
                    if not text:
                        return 0.0

                    text = text.strip()
                    # Sonderfall abfangen: Wenn der WR 'aus' ist, 'x x x' durch '0.0' ersetzen
                    if "x" in text or "X" in text:
                        return 0.0

                    return float(text)
                return 0.0
            except (ValueError, TypeError, IndexError):
                return 0.0

        # Status-Text auslesen (td nach dem td, das 'Status' enthält)
        try:
            status_element = tree.xpath('//td[contains(text(), "Status")]/following-sibling::td')
            status_text = status_element[0].text.strip() if status_element and status_element[0].text else "Unknown"
        except Exception:
            status_text = "Offline"

        return {
            "daily_energy": get_value_by_td(2),
            "generator": {
                "status": status_text,

                "output_l1_voltage": get_value_by_td(4),
                "l1_power": get_value_by_td(6),

                "output_l2_voltage": get_value_by_td(8),
                "l2_power": get_value_by_td(10),

                "output_l3_voltage": get_value_by_td(12),
                "l3_power": get_value_by_td(14),

                "string1_ampere": get_value_by_td(5),
                "string2_ampere": get_value_by_td(9),
                "string3_ampere": get_value_by_td(13)
            }
        }
