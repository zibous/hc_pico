CREATE TABLE pv_readings (
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
CREATE TABLE sqlite_sequence(name,seq);
CREATE INDEX idx_readings_date
                ON pv_readings(date);
CREATE INDEX idx_readings_timestamp
                ON pv_readings(timestamp);
CREATE TABLE pv_history (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                period_type     TEXT    NOT NULL,   -- hour / day / week / month / year
                period_key      TEXT    NOT NULL,   -- z.B. '2025-04-21 08' / '2025-04-21' / '2025W17' / '2025-04' / '2025'
                energy_kwh      REAL    NOT NULL DEFAULT 0.0,
                last_update     TEXT    NOT NULL,   -- ISO8601 UTC
                UNIQUE(period_type, period_key)     -- upsert-fähig
            );
CREATE INDEX idx_history_period
                ON pv_history(period_type, period_key);
