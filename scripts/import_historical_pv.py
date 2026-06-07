#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Import historische PV-Daten (2013–2022) von picodata.db → pv_data.db.

Liest Stundenwerte aus der Test-DB und fügt sie in die Produktions-DB ein.
Erzeugt zusätzlich Tageswerte (period_type='day') aus den Stundenwerten.

Erstellt vorher ein Backup der Ziel-DB.

Usage:
  python scripts/import_historical_pv.py [--dry-run]
  python scripts/import_historical_pv.py --from-year 2013 --to-year 2022
"""

import argparse
import shutil
import sqlite3
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

# Pfade
SOURCE_DB = "testcase/data/picodata.db"
TARGET_DB = "data/pv_data.db"

DEFAULT_FROM_YEAR = 2013
DEFAULT_TO_YEAR = 2022


def parse_args():
    p = argparse.ArgumentParser(description="Import historische PV-Daten → pv_data.db")
    p.add_argument("--source", default=SOURCE_DB, help="Quell-DB (picodata.db)")
    p.add_argument("--target", default=TARGET_DB, help="Ziel-DB (pv_data.db)")
    p.add_argument("--from-year", type=int, default=DEFAULT_FROM_YEAR, help="Ab Jahr (inkl.)")
    p.add_argument("--to-year", type=int, default=DEFAULT_TO_YEAR, help="Bis Jahr (inkl.)")
    p.add_argument("--dry-run", action="store_true", help="Nur anzeigen, nichts schreiben")
    return p.parse_args()


def backup_db(db_path: Path) -> Path:
    """Erstellt ein Backup mit Timestamp."""
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = db_path.with_suffix(f".db.backup_{ts}")
    shutil.copy2(db_path, backup_path)
    return backup_path


def load_source_hours(source_path: str, from_year: int, to_year: int) -> list[dict]:
    """Lädt Stundenwerte aus der Quell-DB für den gewünschten Zeitraum."""
    conn = sqlite3.connect(source_path)
    conn.row_factory = sqlite3.Row

    rows = conn.execute("""
        SELECT period_type, period_key, energy_kwh, last_update
        FROM pv_history
        WHERE period_type = 'hour'
          AND substr(period_key, 1, 4) BETWEEN ? AND ?
        ORDER BY period_key
    """, (str(from_year), str(to_year))).fetchall()

    conn.close()
    return [dict(r) for r in rows]


def aggregate_days(hours: list[dict]) -> list[dict]:
    """Aggregiert Stundenwerte zu Tageswerten."""
    daily: dict[str, float] = defaultdict(float)

    for h in hours:
        day_key = h["period_key"][:10]
        daily[day_key] += h["energy_kwh"]

    now_str = datetime.utcnow().isoformat(timespec="seconds") + "Z"
    return [
        {"period_type": "day", "period_key": k, "energy_kwh": round(v, 3), "last_update": now_str}
        for k, v in sorted(daily.items())
    ]


def aggregate_years(hours: list[dict]) -> list[dict]:
    """Aggregiert Stundenwerte zu Jahreswerten."""
    yearly: dict[str, float] = defaultdict(float)

    for h in hours:
        year_key = h["period_key"][:4]
        yearly[year_key] += h["energy_kwh"]

    now_str = datetime.utcnow().isoformat(timespec="seconds") + "Z"
    return [
        {"period_type": "year", "period_key": k, "energy_kwh": round(v, 3), "last_update": now_str}
        for k, v in sorted(yearly.items())
    ]


def insert_records(target_path: str, records: list[dict], dry_run: bool = False) -> tuple[int, int]:
    """Fügt Records in die Ziel-DB ein. Returns (inserted, skipped)."""
    if dry_run:
        return len(records), 0

    conn = sqlite3.connect(target_path, timeout=30)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=10000")

    inserted = skipped = 0

    for r in records:
        try:
            cur = conn.execute("""
                INSERT OR IGNORE INTO pv_history (period_type, period_key, energy_kwh, last_update)
                VALUES (?, ?, ?, ?)
            """, (r["period_type"], r["period_key"], r["energy_kwh"], r["last_update"]))
            if cur.rowcount > 0:
                inserted += 1
            else:
                skipped += 1
        except sqlite3.IntegrityError:
            skipped += 1

    conn.commit()
    conn.close()
    return inserted, skipped


def main():
    args = parse_args()

    source_path = Path(args.source)
    target_path = Path(args.target)

    if not source_path.exists():
        print(f"❌ Quell-DB nicht gefunden: {source_path}")
        sys.exit(1)

    if not target_path.exists() and not args.dry_run:
        print(f"❌ Ziel-DB nicht gefunden: {target_path}")
        sys.exit(1)

    print("═══ PV Historien-Import ═══")
    print(f"  Quelle:     {source_path}")
    print(f"  Ziel:       {target_path}")
    print(f"  Zeitraum:   {args.from_year} – {args.to_year}")
    print(f"  Dry-Run:    {'JA' if args.dry_run else 'Nein'}")
    print()

    # 1. Backup erstellen
    if not args.dry_run:
        backup = backup_db(target_path)
        print(f"  ✅ Backup erstellt: {backup}")
        print()

    # 2. Stundenwerte laden
    print("  Lade Stundenwerte aus Quell-DB...")
    hours = load_source_hours(str(source_path), args.from_year, args.to_year)
    print(f"  → {len(hours)} Stundenwerte gefunden")

    if not hours:
        print("  ⚠️ Keine Daten im gewünschten Zeitraum.")
        sys.exit(0)

    # Übersicht pro Jahr
    yearly_sum: dict[str, float] = defaultdict(float)
    for h in hours:
        yearly_sum[h["period_key"][:4]] += h["energy_kwh"]

    print("\n  Jahres-Übersicht (Quelle):")
    for year in sorted(yearly_sum):
        print(f"    {year}: {yearly_sum[year]:>8.1f} kWh")

    # 3. Tageswerte aggregieren
    print("\n  Aggregiere Tageswerte...")
    days = aggregate_days(hours)
    print(f"  → {len(days)} Tageswerte berechnet")

    # 4. Jahreswerte aggregieren
    print("  Aggregiere Jahreswerte...")
    years = aggregate_years(hours)
    print(f"  → {len(years)} Jahreswerte berechnet")

    # Gesamt-Records
    all_records = hours + days + years
    print(f"\n  Total zu importieren: {len(all_records)} Records ({len(hours)} Stunden + {len(days)} Tage + {len(years)} Jahre)")

    if args.dry_run:
        print("\n  🏁 Dry-Run fertig — nichts geschrieben.")
        sys.exit(0)

    # 4. In Ziel-DB einfügen
    print("\n  Importiere in Ziel-DB...")
    inserted, skipped = insert_records(str(target_path), all_records)
    print(f"\n  ✅ Fertig: {inserted} eingefügt, {skipped} übersprungen (bereits vorhanden)")
    print(f"  💾 Backup liegt unter: {backup}")


if __name__ == "__main__":
    main()
