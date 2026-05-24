# -*- coding: utf-8 -*-
"""
DatabaseManager
===============

SQLite-Datenbank für PV-Produktionsdaten.

Zwei Tabellen:
    pv_readings   – Live-Messwerte bei jedem Controller-Zyklus
                    (Leistung, Spannung, Phasen, Status)
    pv_history    – Aggregierte Energiewerte
                    (stündlich/täglich/wöchentlich/monatlich/jährlich)

Verwendung:
    db = DatabaseManager()
    db.upsert_reading(payload_dict)
    db.upsert_history(history_dict)
    db.close()

    # oder als Context-Manager
    with DatabaseManager() as db:
        db.upsert_reading(data)
"""

import sqlite3
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from app.core.logging import setup_logger
import app.core.config as settings


class DatabaseManager:
    """
    Verwaltet die SQLite-Datenbank für PV-Daten.
    Thread-safe: Schreiboperationen werden mit einem Lock serialisiert.
    WAL-Modus erlaubt gleichzeitige Reads (Dashboard) während geschrieben wird.
    """

    def __init__(self, db_path: Optional[str] = None):
        self.logger = setup_logger(self.__class__.__name__)
        self._lock = threading.Lock()

        _path = db_path or settings.DB_PATH
        Path(_path).parent.mkdir(parents=True, exist_ok=True)

        self.conn = sqlite3.connect(
            _path,
            check_same_thread=False,
            detect_types=sqlite3.PARSE_DECLTYPES,
            timeout=30,
        )
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA journal_mode=WAL")
        self.conn.execute("PRAGMA busy_timeout=10000")
        self.conn.execute("PRAGMA foreign_keys=ON")

        self._create_tables()
        self.logger.info("DatabaseManager initialisiert: %s", _path)

    # ------------------------------------------------------------------
    # Schema
    # ------------------------------------------------------------------

    def _create_tables(self):
        """Erstellt Tabellen falls nicht vorhanden."""
        self.conn.executescript("""
            -- Live-Messwerte (ein Eintrag pro Controller-Zyklus)
            CREATE TABLE IF NOT EXISTS pv_readings (
                id                  INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp           TEXT    NOT NULL,           -- ISO8601 UTC
                date                TEXT    NOT NULL,           -- YYYY-MM-DD
                time                TEXT,                       -- HH:MM
                aktiv               TEXT,                       -- on / off
                mode                TEXT,                       -- Einspeisen MPP, ...
                current_power       REAL    DEFAULT 0.0,        -- W
                current_power_kw    REAL    DEFAULT 0.0,        -- kW
                total_energy        REAL    DEFAULT 0.0,        -- kWh Gesamtertrag
                daily_energy        REAL    DEFAULT 0.0,        -- kWh Tagesertrag
                -- Generator / Phasen
                string1_voltage     REAL    DEFAULT 0.0,
                string1_ampere      REAL    DEFAULT 0.0,
                string2_voltage     REAL    DEFAULT 0.0,
                string2_ampere      REAL    DEFAULT 0.0,
                string3_voltage     REAL    DEFAULT 0.0,
                string3_ampere      REAL    DEFAULT 0.0,
                output_l1_voltage   REAL    DEFAULT 0.0,
                output_l2_voltage   REAL    DEFAULT 0.0,
                output_l3_voltage   REAL    DEFAULT 0.0,
                l1_power            REAL    DEFAULT 0.0,
                l2_power            REAL    DEFAULT 0.0,
                l3_power            REAL    DEFAULT 0.0,
                gesamtleistung      REAL    DEFAULT 0.0,
                powerfactor         REAL    DEFAULT 0.0,
                -- PV Ost/West
                pv_actual_ost       REAL    DEFAULT 0.0,
                pv_actual_west      REAL    DEFAULT 0.0,
                pv_theoretical_total REAL   DEFAULT 0.0,
                power_factor_theoretical REAL DEFAULT 0.0
            );

            CREATE INDEX IF NOT EXISTS idx_readings_date
                ON pv_readings(date);
            CREATE INDEX IF NOT EXISTS idx_readings_timestamp
                ON pv_readings(timestamp);

            -- Aggregierte Energiehistorie
            -- Granularität: stündlich (period_type='hour'), täglich ('day'),
            --               wöchentlich ('week'), monatlich ('month'), jährlich ('year')
            CREATE TABLE IF NOT EXISTS pv_history (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                period_type     TEXT    NOT NULL,   -- hour / day / week / month / year
                period_key      TEXT    NOT NULL,   -- z.B. '2025-04-21 08' / '2025-04-21' / '2025W17' / '2025-04' / '2025'
                energy_kwh      REAL    NOT NULL DEFAULT 0.0,
                last_update     TEXT    NOT NULL,   -- ISO8601 UTC
                UNIQUE(period_type, period_key)     -- upsert-fähig
            );

            CREATE INDEX IF NOT EXISTS idx_history_period
                ON pv_history(period_type, period_key);
        """)
        self.conn.commit()

    # ------------------------------------------------------------------
    # Live-Messwerte
    # ------------------------------------------------------------------

    def insert_reading(self, data: dict) -> int:
        """Fügt einen Live-Messwert ein. Thread-safe."""
        gen = data.get("generator", {})
        power = data.get("power", {})
        actual = power.get("actual", {})
        theoretical = power.get("theoretical", {})
        now_utc = datetime.now(timezone.utc).isoformat(timespec="seconds")

        row = {
            "timestamp":                data.get("timestamp", now_utc),
            "date":                     data.get("date", ""),
            "time":                     data.get("time", ""),
            "aktiv":                    data.get("aktiv", "off"),
            "mode":                     data.get("mode", ""),
            "current_power":            data.get("current_power", 0.0),
            "current_power_kw":         data.get("current_power_kw", 0.0),
            "total_energy":             data.get("total_energy", 0.0),
            "daily_energy":             data.get("daily_energy", 0.0),
            "string1_voltage":          gen.get("string1_voltage", 0.0),
            "string1_ampere":           gen.get("string1_ampere", 0.0),
            "string2_voltage":          gen.get("string2_voltage", 0.0),
            "string2_ampere":           gen.get("string2_ampere", 0.0),
            "string3_voltage":          gen.get("string3_voltage", 0.0),
            "string3_ampere":           gen.get("string3_ampere", 0.0),
            "output_l1_voltage":        gen.get("output_l1_voltage", 0.0),
            "output_l2_voltage":        gen.get("output_l2_voltage", 0.0),
            "output_l3_voltage":        gen.get("output_l3_voltage", 0.0),
            "l1_power":                 gen.get("l1_power", 0.0),
            "l2_power":                 gen.get("l2_power", 0.0),
            "l3_power":                 gen.get("l3_power", 0.0),
            "gesamtleistung":           gen.get("gesamtleistung", 0.0),
            "powerfactor":              gen.get("powerfactor", 0.0),
            "pv_actual_ost":            actual.get("pv_ost", 0.0),
            "pv_actual_west":           actual.get("pv_west", 0.0),
            "pv_theoretical_total":     theoretical.get("total", 0.0),
            "power_factor_theoretical": data.get("power_factor_theoretical", 0.0),
        }

        with self._lock:
            cursor = self.conn.execute("""
                INSERT INTO pv_readings (
                    timestamp, date, time, aktiv, mode,
                    current_power, current_power_kw, total_energy, daily_energy,
                    string1_voltage, string1_ampere,
                    string2_voltage, string2_ampere,
                    string3_voltage, string3_ampere,
                    output_l1_voltage, output_l2_voltage, output_l3_voltage,
                    l1_power, l2_power, l3_power,
                    gesamtleistung, powerfactor,
                    pv_actual_ost, pv_actual_west,
                    pv_theoretical_total, power_factor_theoretical
                ) VALUES (
                    :timestamp, :date, :time, :aktiv, :mode,
                    :current_power, :current_power_kw, :total_energy, :daily_energy,
                    :string1_voltage, :string1_ampere,
                    :string2_voltage, :string2_ampere,
                    :string3_voltage, :string3_ampere,
                    :output_l1_voltage, :output_l2_voltage, :output_l3_voltage,
                    :l1_power, :l2_power, :l3_power,
                    :gesamtleistung, :powerfactor,
                    :pv_actual_ost, :pv_actual_west,
                    :pv_theoretical_total, :power_factor_theoretical
                )
            """, row)
            self.conn.commit()

        self.logger.debug(
            "insert_reading: rowid=%s | %s | aktiv=%s | %.1f W | daily=%.3f kWh",
            cursor.lastrowid, row["timestamp"], row["aktiv"],
            row["current_power"], row["daily_energy"],
        )
        return cursor.lastrowid or 0

    # ------------------------------------------------------------------
    # Energiehistorie
    # ------------------------------------------------------------------

    def upsert_history(self, data: dict):
        """
        Aktualisiert die aggregierten Energiewerte. Thread-safe.

        Stundenwerte: MAX(daily_energy) - MIN(daily_energy) pro Stunde
        aus pv_readings — zuverlässiger als der laufende power_hour-Zähler.
        """
        total = data.get("total", {})
        now_utc = datetime.now(timezone.utc).isoformat(timespec="seconds")
        date_str = data.get("date", datetime.now().strftime("%Y-%m-%d"))
        week_str = data.get("week", "")
        now = datetime.now()

        with self._lock:
            # Stundenwert der aktuellen Stunde aus pv_readings berechnen
            hour_key = f"{date_str} {now.hour:02d}"
            row = self.conn.execute("""
                SELECT MAX(daily_energy) - MIN(daily_energy) AS hour_kwh
                FROM pv_readings
                WHERE date = ? AND time LIKE ?
                  AND daily_energy > 0
            """, (date_str, f"{now.hour:02d}:%")).fetchone()

            hour_kwh = round(row[0], 3) if row and row[0] and row[0] > 0 else 0.0

            entries = []
            if hour_kwh > 0:
                entries.append(("hour", hour_key, hour_kwh))

            # Fehlende Stunden des heutigen Tages nachberechnen
            for h in range(24):
                if h == now.hour:
                    continue
                key = f"{date_str} {h:02d}"
                existing = self.conn.execute(
                    "SELECT energy_kwh FROM pv_history WHERE period_type='hour' AND period_key=?",
                    (key,)
                ).fetchone()
                if existing and existing[0] > 0:
                    continue
                r = self.conn.execute("""
                    SELECT MAX(daily_energy) - MIN(daily_energy) AS hour_kwh
                    FROM pv_readings
                    WHERE date = ? AND time LIKE ?
                      AND daily_energy > 0
                """, (date_str, f"{h:02d}:%")).fetchone()
                if r and r[0] and r[0] > 0:
                    entries.append(("hour", key, round(r[0], 3)))

            # Tag/Woche/Monat/Jahr — normaler upsert (Wert wird ersetzt, nicht MAX)
            day_entries = [
                ("day",   date_str,              total.get("power_day",   0.0)),
                ("week",  week_str,              total.get("power_week",  0.0)),
                ("month", now.strftime("%Y-%m"), total.get("power_month", 0.0)),
                ("year",  now.strftime("%Y"),    total.get("power_year",  0.0)),
            ]

            # Stundenwerte: MAX (nur steigend)
            if entries:
                self.conn.executemany("""
                    INSERT INTO pv_history (period_type, period_key, energy_kwh, last_update)
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(period_type, period_key)
                    DO UPDATE SET
                        energy_kwh  = MAX(pv_history.energy_kwh, excluded.energy_kwh),
                        last_update = excluded.last_update
                """, [(pt, pk, round(kwh, 3), now_utc) for pt, pk, kwh in entries])

            # Tag/Woche/Monat/Jahr: direkter Replace
            self.conn.executemany("""
                INSERT INTO pv_history (period_type, period_key, energy_kwh, last_update)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(period_type, period_key)
                DO UPDATE SET
                    energy_kwh  = excluded.energy_kwh,
                    last_update = excluded.last_update
            """, [(pt, pk, round(kwh, 3), now_utc) for pt, pk, kwh in day_entries])

            self.conn.commit()

        all_entries = entries + day_entries if 'day_entries' in dir() else entries
        self.logger.debug(
            "upsert_history: %s",
            " | ".join(f"{pt}={pk}:{kwh:.3f}kWh" for pt, pk, kwh in all_entries)
        )

    def upsert_history_row(self, period_type: str, period_key: str, energy_kwh: float):
        """Einzelner Upsert — wird vom CSV-Import-Skript verwendet."""
        now_utc = datetime.now(timezone.utc).isoformat(timespec="seconds")
        with self._lock:
            self.conn.execute("""
                INSERT INTO pv_history (period_type, period_key, energy_kwh, last_update)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(period_type, period_key)
                DO UPDATE SET
                    energy_kwh  = excluded.energy_kwh,
                    last_update = excluded.last_update
            """, (period_type, period_key, round(energy_kwh, 3), now_utc))

    def commit(self):
        """Expliziter Commit — für Batch-Operationen (CSV-Import)."""
        self.conn.commit()

    # ------------------------------------------------------------------
    # Abfragen (für Dashboard-API)
    # ------------------------------------------------------------------

    def get_latest_reading(self) -> Optional[dict]:
        """Letzter Live-Messwert."""
        row = self.conn.execute(
            "SELECT * FROM pv_readings ORDER BY timestamp DESC LIMIT 1"
        ).fetchone()
        return dict(row) if row else None

    def get_readings_by_date(self, date: str) -> list[dict]:
        """Alle Messwerte eines Tages. date = 'YYYY-MM-DD'"""
        rows = self.conn.execute(
            "SELECT * FROM pv_readings WHERE date = ? ORDER BY timestamp",
            (date,)
        ).fetchall()
        return [dict(r) for r in rows]

    def get_history(self, period_type: str, limit: int = 365) -> list[dict]:
        """
        Historieneinträge nach Typ, neueste zuerst.

        Args:
            period_type: 'hour' | 'day' | 'week' | 'month' | 'year'
            limit:       max. Anzahl Einträge
        """
        rows = self.conn.execute("""
            SELECT period_type, period_key, energy_kwh, last_update
            FROM pv_history
            WHERE period_type = ?
            ORDER BY period_key DESC
            LIMIT ?
        """, (period_type, limit)).fetchall()
        return [dict(r) for r in rows]

    def get_history_range(self, period_type: str, from_key: str, to_key: str) -> list[dict]:
        """Historieneinträge in einem Zeitbereich."""
        rows = self.conn.execute("""
            SELECT period_type, period_key, energy_kwh, last_update
            FROM pv_history
            WHERE period_type = ? AND period_key BETWEEN ? AND ?
            ORDER BY period_key
        """, (period_type, from_key, to_key)).fetchall()
        return [dict(r) for r in rows]

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def close(self):
        """Schließt die Datenbankverbindung."""
        if self.conn:
            self.conn.close()
            self.logger.info("Datenbankverbindung geschlossen")

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        self.close()
