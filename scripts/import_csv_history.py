#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
import_csv_history.py
=====================

Importiert historische CSV-Tagesdaten in die SQLite-Datenbank.

CSV-Format (Semikolon-getrennt, deutsches Dezimalkomma):
    Zeit;Verbrauch
    2025-04-21 08:00:00;2,021

Ablauf:
    - Durchsucht data/YYYY/MM/DD.csv rekursiv
    - Liest stündliche Produktionswerte (Verbrauch = PV-Produktion in kWh)
    - Schreibt in pv_history mit period_type='hour' und 'day'
    - Überspringt bereits vorhandene Einträge (upsert)
    - Gibt Fortschritt und Zusammenfassung aus

Aufruf:
    python scripts/import_csv_history.py
    python scripts/import_csv_history.py --dry-run
    python scripts/import_csv_history.py --year 2025
"""

import sys
import argparse
import csv
from pathlib import Path
from datetime import datetime

# Projekt-Root zum Suchpfad hinzufügen
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.db_manager import DatabaseManager
from utils.logging_setup import setup_logger

logger = setup_logger("import_csv_history")


def parse_german_float(value: str) -> float:
    """Wandelt deutsches Dezimalkomma in float: '2,021' → 2.021"""
    try:
        return float(value.strip().replace(",", "."))
    except (ValueError, AttributeError):
        return 0.0


def import_csv_file(db: DatabaseManager, csv_path: Path, dry_run: bool = False) -> tuple[int, int]:
    """
    Importiert eine einzelne CSV-Datei.

    Returns:
        (imported_rows, skipped_rows)
    """
    imported = 0
    skipped = 0
    daily_total = 0.0
    date_str = None

    try:
        # Encoding-Fallback: utf-8 → latin-1
        for encoding in ("utf-8", "latin-1"):
            try:
                with open(csv_path, encoding=encoding, newline="") as f:
                    reader = csv.DictReader(f, delimiter=";")
                    rows_data = list(reader)
                break
            except UnicodeDecodeError:
                continue
        else:
            logger.warning("Encoding-Fehler, überspringe: %s", csv_path)
            return 0, 1

        for row in rows_data:
            zeit_raw = row.get("Zeit", "").strip()
            verbrauch_raw = row.get("Verbrauch", "0").strip()

            if not zeit_raw:
                skipped += 1
                continue

            try:
                dt = datetime.strptime(zeit_raw, "%Y-%m-%d %H:%M:%S")
            except ValueError:
                logger.warning("Ungültiges Datum in %s: %s", csv_path, zeit_raw)
                skipped += 1
                continue

            energy = parse_german_float(verbrauch_raw)
            date_str = dt.strftime("%Y-%m-%d")
            hour_key = f"{date_str} {dt.hour:02d}"
            daily_total += energy

            if not dry_run:
                db.upsert_history_row("hour", hour_key, energy)

            imported += 1

        # Tageswert eintragen
        if date_str and daily_total > 0 and not dry_run:
            db.upsert_history_row("day", date_str, round(daily_total, 3))

            # Wochenwert (wird durch upsert akkumuliert — hier nur als Marker)
            dt_day = datetime.strptime(date_str, "%Y-%m-%d")
            iso_year, iso_week, _ = dt_day.isocalendar()
            week_key = f"{iso_year}W{iso_week:02d}"
            month_key = dt_day.strftime("%Y-%m")
            year_key = dt_day.strftime("%Y")

            # Woche/Monat/Jahr werden durch den Controller laufend aktualisiert.
            # Beim Import setzen wir sie nur wenn noch kein Eintrag existiert.
            for pt, pk in [("week", week_key), ("month", month_key), ("year", year_key)]:
                existing = db.conn.execute(
                    "SELECT energy_kwh FROM pv_history WHERE period_type=? AND period_key=?",
                    (pt, pk)
                ).fetchone()
                if existing:
                    # Addieren (CSV-Import summiert auf)
                    new_val = round(existing["energy_kwh"] + daily_total, 3)
                    db.conn.execute(
                        "UPDATE pv_history SET energy_kwh=? WHERE period_type=? AND period_key=?",
                        (new_val, pt, pk)
                    )
                else:
                    db.upsert_history_row(pt, pk, round(daily_total, 3))

    except Exception:
        logger.exception("Fehler beim Importieren von %s", csv_path)

    return imported, skipped


def run_import(data_dir: Path, dry_run: bool = False, year_filter: str | None = None):
    """Hauptfunktion: Alle CSV-Dateien importieren."""

    # CSV-Dateien finden: data/YYYY/MM/DD.csv
    # export/-Ordner explizit ausschließen
    pattern = f"{year_filter}/**/*.csv" if year_filter else "**/*.csv"
    csv_files = sorted(
        p for p in data_dir.glob(pattern)
        if "export" not in p.parts and p.stat().st_size > 0
    )

    if not csv_files:
        print(f"Keine CSV-Dateien gefunden in {data_dir}")
        return

    print(f"{'[DRY-RUN] ' if dry_run else ''}Gefunden: {len(csv_files)} CSV-Dateien")
    print(f"Datenbank: {data_dir / 'pv_data.db'}\n")

    total_imported = 0
    total_skipped = 0
    files_processed = 0

    with DatabaseManager(db_path=str(data_dir / "pv_data.db")) as db:
        for i, csv_path in enumerate(csv_files, 1):
            imported, skipped = import_csv_file(db, csv_path, dry_run=dry_run)

            # Batch-Commit alle 30 Dateien
            if not dry_run and i % 30 == 0:
                db.commit()

            total_imported += imported
            total_skipped += skipped
            files_processed += 1

            # Fortschritt
            if i % 50 == 0 or i == len(csv_files):
                print(f"  [{i:4d}/{len(csv_files)}] {csv_path.relative_to(data_dir)} "
                      f"— {imported} Zeilen importiert")

        if not dry_run:
            db.commit()

    print(f"\n{'=' * 50}")
    print("Import abgeschlossen:")
    print(f"  Dateien verarbeitet : {files_processed}")
    print(f"  Zeilen importiert   : {total_imported}")
    print(f"  Zeilen übersprungen : {total_skipped}")
    if dry_run:
        print("  [DRY-RUN] Keine Daten wurden gespeichert")


def main():
    parser = argparse.ArgumentParser(
        description="Importiert historische CSV-PV-Daten in SQLite"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Nur lesen, nichts schreiben"
    )
    parser.add_argument(
        "--year",
        type=str,
        default=None,
        help="Nur ein bestimmtes Jahr importieren, z.B. --year 2025"
    )
    parser.add_argument(
        "--data-dir",
        type=str,
        default=None,
        help="Pfad zum data-Verzeichnis (Standard: ./data)"
    )
    args = parser.parse_args()

    data_dir = Path(args.data_dir) if args.data_dir else Path(__file__).parent.parent / "data"

    if not data_dir.exists():
        print(f"Fehler: Verzeichnis nicht gefunden: {data_dir}")
        sys.exit(1)

    run_import(data_dir=data_dir, dry_run=args.dry_run, year_filter=args.year)


if __name__ == "__main__":
    main()
