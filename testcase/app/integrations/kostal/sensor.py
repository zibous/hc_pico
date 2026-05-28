# -*- coding: utf-8 -*-
from app.integrations.kostal.models import GeneratorData, AdvancedAnalytics # AdvancedAnalytics hinzugefügt
from app.integrations.kostal.calculator import PikoCalculator
from app.integrations.kostal.pv_model import PikoPVModel
from app.integrations.kostal.history_tracker import PikoHistoryTracker

class PikoSensor:
    def __init__(self, config, data):
        self.logger = setup_logger(self.__class__.__name__)
        self.config = config
        self.data = data

        # Generator-Rohdaten sofort via Pydantic absichern
        raw_gen = data.get("generator", {})
        self.generator_model = GeneratorData(**raw_gen)

        # Status direkt dynamisch übernehmen
        self.status = self.generator_model.status
        self.dataready = False

        # Sub-Module instanziieren
        self.pv_model = PikoPVModel(config, self.logger)
        self.history_tracker = PikoHistoryTracker(config, self.logger)

    def process_data(self, current_daily_energy, db_path: str, today_kwh: float):
        """Zentraler Aufruf für deine Applikation"""

        # 1. Leistungsfaktoren dynamisch im Pydantic-Modell berechnen
        self.generator_model = PikoCalculator.calculate_power_factors(self.generator_model)

        # =========================================================================
        # NEU: ERWEITERTE BERECHNUNGEN AUSFÜHREN UND IM MODELL SPEICHERN
        # =========================================================================

        # A. Heutige Einspeisedauer aus der SQLite berechnen
        self.generator_model.einspeisedauer_h = PikoCalculator.calculate_today_einspeisung(db_path)

        # B. Erweiterte Analysen (Effizienz, Blindleistung, Symmetrie, CO2) berechnen
        advanced_data = PikoCalculator.calculate_advanced_analytics(self.generator_model, today_kwh)

        # C. Das verschachtelte Pydantic-Modell typsicher zuweisen
        self.generator_model.analytics = AdvancedAnalytics(**advanced_data)

        # =========================================================================

        # Status im laufenden Betrieb aktualisieren
        self.status = self.generator_model.status

        # Das berechnete Objekt als Dictionary in self.data zurückschreiben (inklusive der neuen Felder!)
        self.data["generator"] = self.generator_model.model_dump()

        # 2. Laufzeit auslesen (liefert Tage, Stunden, Minuten, Sekunden)
        runtime_stats = PikoCalculator.calculate_running_time(self.config.get("installed"))

        # 3. Physikalisches PV-Modell berechnen
        pv_stats = self.pv_model.calculate_theoretical_power()

        # 4. Historie wegschreiben (mit wasserfestem Spike-Schutz)
        history_stats = self.history_tracker.update_metrics(current_daily_energy)

        self.dataready = True

        return {
            "status": self.status,
            "runtime": runtime_stats,
            "theoretical_pv": pv_stats,
            "history": history_stats,
            "live_data": self.data
        }
