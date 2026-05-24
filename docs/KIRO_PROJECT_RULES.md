# Projektregeln

## Allgemein
- Python 3.12 verwenden
- Type hints überall
- Kleine Funktionen bevorzugen
- Maximal 300 Zeilen pro Datei
- Kein unnötiger Code

## Architektur
- Business Logic nur in services/
- API Routes bleiben dünn
- Datenbanklogik nur in repositories/
- Utility Funktionen in utils/

## FastAPI
- Async Endpoints bevorzugen
- Pydantic v2 verwenden
- Dependency Injection nutzen

## Datenbank
- SQLAlchemy async
- Alembic für Migrationen
- PostgreSQL verwenden

## Qualität
- Ruff für Linting
- Black für Formatting
- pytest für Tests

## Tests
- Für neue Features immer Tests schreiben
- Keine echten API Calls in Tests
- Mocking verwenden

## Antworten der KI
- Erst Plan zeigen
- Dann Code generieren
- Keine kompletten Dateien überschreiben
- Nur relevante Änderungen machen