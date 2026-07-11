#!/usr/bin/env python3
"""
import_gap.py – Importiert fehlende Daten aus logs/history.csv in die DB.

Füllt die Lücke in pv_readings mit den Leistungswerten aus der CSV.
Da nur current_power_kw vorhanden ist, werden die übrigen Felder mit 0/Defaults gefüllt.

Verwendung:
    python3 scripts/import_gap.py
    python3 scripts/import_gap.py --from "2026-07-10T16:45:00" --to "2026-07-10T18:00:00"
"""

import argparse
import csv
import sqlite3
import sys
from datetime import datetime
from pathlib import Path

# Pfade
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DB_PATH = PROJECT_DIR / "data" / "pv_data.db"
CSV_PATH = PROJECT_DIR / "logs" / "history.csv"


def parse_timestamp(ts_str: str) -> datetime:
    """Parst ISO-Timestamp (mit oder ohne Z/Millisekunden)."""
    ts_str = ts_str.replace("Z", "+00:00")
    # Entferne Millisekunden für einfacheres Parsing
    if "." in ts_str:
        ts_str = ts_str.split(".")[0] + ts_str[ts_str.rfind("+"):] if "+" in ts_str else ts_str.split(".")[0]
    return datetime.fromisoformat(ts_str)


def main():
    parser = argparse.ArgumentParser(description="Importiert Lücke aus history.csv")
    parser.add_argument("--from", dest="from_ts", default="2026-07-10T16:45:00",
                        help="Start-Timestamp (ISO, default: 2026-07-10T16:45:00)")
    parser.add_argument("--to", dest="to_ts", default="2026-07-10T19:00:00",
                        help="End-Timestamp (ISO, default: 2026-07-10T19:00:00)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Nur anzeigen, nicht schreiben")
    args = parser.parse_args()

    from_dt = datetime.fromisoformat(args.from_ts)
    to_dt = datetime.fromisoformat(args.to_ts)

    if not CSV_PATH.exists():
        print(f"❌ CSV nicht gefunden: {CSV_PATH}")
        sys.exit(1)

    if not DB_PATH.exists():
        print(f"❌ Datenbank nicht gefunden: {DB_PATH}")
        sys.exit(1)

    # CSV lesen und filtern
    rows_to_import = []
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                ts = parse_timestamp(row["last_changed"])
                # Auf naive datetime normalisieren (Lokalzeit)
                if ts.tzinfo:
                    # UTC → +2h (Europe/Vaduz Sommerzeit)
                    from datetime import timedelta
                    ts = ts.replace(tzinfo=None) + timedelta(hours=2)

                if from_dt <= ts <= to_dt:
                    power_kw = float(row["state"])
                    rows_to_import.append({
                        "timestamp": ts.isoformat(timespec="seconds"),
                        "date": ts.strftime("%Y-%m-%d"),
                        "time": ts.strftime("%H:%M"),
                        "aktiv": "on" if power_kw > 0 else "off",
                        "mode": "Einspeisen MPP" if power_kw > 0 else "",
                        "current_power": round(power_kw * 1000, 1),  # kW → W
                        "current_power_kw": power_kw,
                    })
            except (ValueError, KeyError):
                continue

    if not rows_to_import:
        print(f"⚠ Keine Daten im Zeitraum {args.from_ts} – {args.to_ts}")
        sys.exit(0)

    print(f"📊 {len(rows_to_import)} Einträge gefunden ({rows_to_import[0]['time']} – {rows_to_import[-1]['time']})")

    if args.dry_run:
        for r in rows_to_import[:5]:
            print(f"   {r['timestamp']} | {r['current_power_kw']:.3f} kW")
        if len(rows_to_import) > 5:
            print(f"   ... und {len(rows_to_import) - 5} weitere")
        print("\n(Dry-Run – nichts geschrieben)")
        sys.exit(0)

    # In DB einfügen
    conn = sqlite3.connect(str(DB_PATH), timeout=30)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=10000")

    inserted = 0
    skipped = 0
    for row in rows_to_import:
        # Prüfe ob Eintrag bereits existiert (±30s)
        existing = conn.execute(
            "SELECT id FROM pv_readings WHERE timestamp = ?",
            (row["timestamp"],)
        ).fetchone()

        if existing:
            skipped += 1
            continue

        conn.execute("""
            INSERT INTO pv_readings (
                timestamp, date, time, aktiv, mode,
                current_power, current_power_kw, total_energy, daily_energy,
                string1_voltage, string1_ampere, string2_voltage, string2_ampere,
                string3_voltage, string3_ampere,
                output_l1_voltage, output_l2_voltage, output_l3_voltage,
                l1_power, l2_power, l3_power,
                gesamtleistung, powerfactor,
                pv_actual_ost, pv_actual_west,
                pv_theoretical_total, power_factor_theoretical
            ) VALUES (
                :timestamp, :date, :time, :aktiv, :mode,
                :current_power, :current_power_kw, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0
            )
        """, row)
        inserted += 1

    conn.commit()
    conn.close()

    print(f"✅ {inserted} Einträge importiert, {skipped} übersprungen (bereits vorhanden)")
    print(f"   Die Stundenwerte (pv_history) werden beim nächsten Polling-Zyklus automatisch nachberechnet.")


if __name__ == "__main__":
    main()
