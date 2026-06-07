import os
import sqlite3
import pandas as pd

# Pfade zu deinen Dateien
DB_PFAD = "./data/picodata.db"
DB_PFAD = "/dockerapps/apps_v2/hc_pico/data/pv_data.db"
EXPORT_ORDNER = "./data/analyse"


def show_and_export_pv_analysis(db_path, export_folder):
    if not os.path.exists(db_path):
        print(f"Fehler: Datenbank unter '{db_path}' nicht gefunden.")
        return

    # Export-Ordner erstellen, falls er noch nicht existiert
    os.makedirs(export_folder, exist_ok=True)

    # Verbindung zur Datenbank herstellen
    conn = sqlite3.connect(db_path)

    # Die drei SELECT-Queries (aufsteigend sortiert)
    # Wichtig: Für den CSV-Export entfernen wir beim Tag das LIMIT, damit alle Tage exportiert werden!
    queries = {
        "tag": {
            "titel": "TÄGLICHER ERTRAG",
            "sql": """
                SELECT
                    substr(period_key, 1, 10) AS Tag,
                    round(sum(energy_kwh), 3) AS "Gesamt kWh"
                FROM pv_history
                WHERE period_type = 'hour'
                GROUP BY Tag
                ORDER BY Tag ASC;
            """,
        },
        "monat": {
            "titel": "MONATLICHER ERTRAG",
            "sql": """
                SELECT
                    substr(period_key, 1, 7) AS Monat,
                    round(sum(energy_kwh), 3) AS "Gesamt kWh"
                FROM pv_history
                WHERE period_type = 'hour'
                GROUP BY Monat
                ORDER BY Monat ASC;
            """,
        },
        "jahr": {
            "titel": "JÄHRLICHER ERTRAG",
            "sql": """
                SELECT
                    substr(period_key, 1, 4) AS Jahr,
                    round(sum(energy_kwh), 3) AS "Gesamt kWh"
                FROM pv_history
                WHERE period_type = 'hour'
                GROUP BY Jahr
                ORDER BY Jahr ASC;
            """,
        },
    }

    print("=" * 50)
    print("      PV-ANLAGE: HISTORISCHE AUSWERTUNG & EXPORT")
    print("=" * 50)

    try:
        for key, info in queries.items():
            # 1. Daten via Pandas aus der Query lesen
            df = pd.read_sql_query(info["sql"], conn)

            print(f"\n--- {info['titel']} ---")
            if df.empty:
                print("Keine Daten verfügbar.")
                continue

            # 2. CSV-EXPORT (Excel / Numbers Format)
            datei_name = f"pv_analyse_{key}.csv"
            export_pfad = os.path.join(export_folder, datei_name)

            # Speichert das originale DataFrame mit Semikolon und Komma-Dezimalzeichen
            df.to_csv(export_pfad, sep=";", decimal=",", index=False)
            print(f"[Info] CSV-Export gespeichert unter: {export_pfad}")

            # 3. KONSOLEN-AUSGABE (Kompakt aufbereitet)
            # Für die Konsole begrenzen wir die Anzeige der Tage auf die ersten 10
            df_preview = df.head(10) if key == "tag" else df

            # Formatierung für die Konsolen-Texttabelle anpassen
            df_preview = df_preview.copy()
            df_preview["Gesamt kWh"] = df_preview["Gesamt kWh"].apply(
                lambda x: f"{x:,.3f}".replace(",", "X")
                .replace(".", ",")
                .replace("X", ".")
            )

            # Tabellenanzeige im Terminal
            print(df_preview.to_string(index=False))
            if key == "tag" and len(df) > 10:
                print(f"... und {len(df) - 10} weitere Tage in der CSV-Datei.")

        print("\n" + "=" * 50)
        print("Alle Analysen und CSV-Exporte erfolgreich abgeschlossen!")

    except Exception as e:
        print(f"Fehler bei der Verarbeitung: {e}")
    finally:
        conn.close()


if __name__ == "__main__":
    show_and_export_pv_analysis(DB_PFAD, EXPORT_ORDNER)
