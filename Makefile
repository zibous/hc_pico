# Makefile for hc_pico (home-picokostal)

# --- 1. DYNAMISCHE PARAMETER & VARIABLEN ---
PROJECT_NAME = $(notdir $(CURDIR))
FORGEJO_IP   = 10.1.1.19
FORGEJO_PORT = 3143
FORGEJO_USER = peter
FORGEJO_URL  = http://$(FORGEJO_IP):$(FORGEJO_PORT)/$(FORGEJO_USER)/$(PROJECT_NAME).git

.DEFAULT_GOAL := help
.PHONY: build up down restart rebuild logs ps run dev install clean backup help jsbuild

# ---------------------------------------------------------
# Python interpreter (venv preferred, fallback python3)
# ---------------------------------------------------------
CONTAINER := $(shell basename $(CURDIR))
PYTHON := $(shell if [ -f /dockerapps/apps_v2/.venv/bin/python ]; then echo /dockerapps/apps_v2/.venv/bin/python; else echo python3; fi)

# ---------------------------------------------------------
# Lokales Ausfuehren
# ---------------------------------------------------------
run: ## Startet lokal (Controller + Dashboard)
	@PYTHONPATH=$(CURDIR) $(PYTHON) app/main.py

dev: ## Startet lokal mit DEBUG Logging
	@PYTHONPATH=$(CURDIR) LOG_LEVEL=DEBUG $(PYTHON) app/main.py

# ---------------------------------------------------------
# Docker
# ---------------------------------------------------------
build: ## Build Docker image
	docker compose build

up: ## Start containers
	docker compose up -d

down: ## Stop containers
	docker compose down

restart: ## Restart containers
	docker compose restart

rebuild: ## Rebuild and restart (no cache)
	docker compose down
	docker compose build --no-cache
	docker compose up -d --force-recreate

logs: ## Show logs (follow)
	docker compose logs -f

ps: ## Running containers
	docker compose ps

# ---------------------------------------------------------
# Maintenance
# ---------------------------------------------------------
install: ## Install dependencies
	@pip install -r requirements.txt

clean: ## Remove cache files
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -name "*.pyc" -delete 2>/dev/null || true

backup: ## Backup database
	@cp data/pv_data.db data/pv_data.db.bak.$$(date +%Y%m%d) 2>/dev/null && \
		echo "✅ Backup: data/pv_data.db.bak.$$(date +%Y%m%d)" || \
		echo "❌ Keine DB gefunden"

graph:
	pyreverse app -o png

compare: ## Vergleicht lokale Dateien mit Container-Inhalt
	@mkdir -p /tmp/hc_pico_files
	@docker cp hc_pico:/app/. /tmp/hc_pico_files/
	@echo "─── Geänderte Dateien ───"
	@diff -qr --exclude="__pycache__" --exclude="*.pyc" --exclude=".git" \
		--exclude="data" --exclude="logs" --exclude=".env" --exclude=".ruff_cache" \
		./ /tmp/hc_pico_files/ 2>/dev/null | sort || true
	@echo ""
	@echo "─── Nur lokal (neu/nicht im Container) ───"
	@diff -qr --exclude="__pycache__" --exclude="*.pyc" --exclude=".git" \
		--exclude="data" --exclude="logs" --exclude=".env" --exclude=".ruff_cache" \
		./ /tmp/hc_pico_files/ 2>/dev/null | grep "Nur in \./" | sort || true
	@echo ""
	@echo "─── Nur im Container (lokal gelöscht) ───"
	@diff -qr --exclude="__pycache__" --exclude="*.pyc" --exclude=".git" \
		--exclude="data" --exclude="logs" --exclude=".env" --exclude=".ruff_cache" \
		./ /tmp/hc_pico_files/ 2>/dev/null | grep "Nur in /tmp/" | sort || true
	@rm -rf /tmp/hc_pico_files

diff-detail: ## Zeigt inhaltliche Unterschiede zum Container
	@mkdir -p /tmp/hc_pico_files
	@docker cp hc_pico:/app/. /tmp/hc_pico_files/
	@diff -ur --exclude="__pycache__" --exclude="*.pyc" --exclude=".git" \
		--exclude="data" --exclude="logs" --exclude=".env" --exclude=".ruff_cache" \
		/tmp/hc_pico_files/ ./ 2>/dev/null || true
	@rm -rf /tmp/hc_pico_files


jsbuild: ## Komprimiert JS und CSS parallel über Docker – maximal optimiert
	@echo "📦 Starte JS & CSS Bundling via Docker & esbuild..."
	@cp ../shared/themes/theme.css frontend/static/css/theme.css
	@docker run --rm -v "$$(pwd)":/app -w /app node:20-alpine sh -c "\
		npx esbuild frontend/static/js/v2/main.js --bundle --minify --sourcemap --target=es2020 --outfile=frontend/static/js/v2/main.bundle.js && \
		npx esbuild frontend/static/css/style.css --bundle --minify --sourcemap --outfile=frontend/static/css/style.bundle.css"
	@echo "✅ Fertig! JS und CSS Bundles wurden erfolgreich im static-Ordner erstellt."

jsclean: ## Komprimiert JS und CSS entfernen
	@echo "🧼 Bereinige produktive Build-Dateien..."
	@rm -f frontend/static/js/app.bundle.js
	@rm -f frontend/static/js/app.bundle.js.map
	@rm -f frontend/static/css/style.bundle.css
	@rm -f frontend/static/css/style.bundle.css.map
	@echo "✨ Verzeichnis ist wieder sauber."

git-status: ## Zeigt die aktuelle Forgejo Server-Verbindung (Remote URL) an
	@echo "🔍 Überprüfe Git-Remote-Konfiguration..."
	@if ! git remote get-url origin >/dev/null 2>&1; then \
		echo "❌ Fehler: 'origin' ist noch nicht eingerichtet!"; \
		echo "👉 Bitte führe aus: make git-setup"; \
		exit 1; \
	fi
	@URL=$$(git remote get-url origin); \
	echo "🍏 Forgejo-Server ist aktiv verbunden!" ; \
	echo "🔗 Aktuelle URL: $$URL"

git-setup: ## Git-Verbindung zum Forgejo-Server automatisch einrichten oder korrigieren
	@echo "🛠️ Initialisiere Forgejo Server-Verbindung für '$(PROJECT_NAME)'..."
	@if ! git remote get-url origin >/dev/null 2>&1; then \
		git remote add origin $(FORGEJO_URL); \
		echo "🎉 Server-URL erfolgreich neu angelegt!"; \
	else \
		git remote set-url origin $(FORGEJO_URL); \
		echo "🔄 Bestehende Server-URL erfolgreich korrigiert!"; \
	fi
	@echo "🔗 Ziel-Adresse: $(FORGEJO_URL)"

git-update: git-status ## Git Forgejo Update durchführen (Normaler Zwischenstand)
	git add -A
	git commit -m "Update am $$(date +'%Y-%m-%d %H:%M')" || true
	git push -u origin main

git-release: git-status ## Neues Versions-Tag automatisch berechnen, erstellen und zu Forgejo pushen
	git add -A
	git commit -m "Release-Vorbereitung am $$(date +'%Y-%m-%d %H:%M')" || true
	git push origin main
	@LAST_TAG=$$(git describe --tags --abbrev=0 2>/dev/null || echo "v2.1.0"); \
	NEXT_TAG=$$(echo $$LAST_TAG | awk -F. '{print $$1"."$$2"."$$3+1}'); \
	echo "🍏 Letzte Version war: $$LAST_TAG"; \
	echo "⚡ Berechnete neue Version: $$NEXT_TAG"; \
	echo "📦 Erstelle Git-Tag $$NEXT_TAG mit aktuellem Zeitstempel..."; \
	git tag -a $$NEXT_TAG -m "Automatisches Release $$NEXT_TAG am $$(date +'%Y-%m-%d %H:%M') via Makefile"; \
	git push origin $$NEXT_TAG; \
	echo "🎉 Version $$NEXT_TAG erfolgreich an Forgejo übermittelt!"



# ---------------------------------------------------------
# Help
# ---------------------------------------------------------
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
