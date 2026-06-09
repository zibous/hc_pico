# Makefile for hc_pico (home-picokostal)

.DEFAULT_GOAL := help
.PHONY: build up down restart rebuild logs ps run dev install clean backup help

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

git-update: ## Git Forgejo Update durchführen
	git remote set-url origin http://10.1.1.119:3043/peter/hc_pico.git
	git add -A
	git commit -m "Update am $$(date +'%Y-%m-%d %H:%M')" || true
	git push -u origin main

# Deine bestehenden Befehle bleiben komplett gleich:
git-update: ## Git Forgejo Update durchführen
	git remote set-url origin http://10.1.1.119:3043/peter/hc_pico.git
	git add -A
	git commit -m "Update am $$(date +'%Y-%m-%d %H:%M')" || true
	git push -u origin main

git-release: ## Aufruf im Terminal: 'make git-release V=2.1.0'
	@if [ -z "$(V)" ]; then \
		echo "❌ Fehler: Bitte Versionsnummer angeben! Beispiel: make git-release V=2.1.0"; \
		exit 1; \
	fi
	git remote set-url origin http://10.1.1.119:3043/peter/hc_pico.git
	git add -A
	git commit -m "Release-Vorbereitung für v$(V)" || true
	git push origin main
	@echo "🍏 Erstelle Git-Tag v$(V) mit aktuellem Zeitstempel..."
	git tag -a v$(V) -m "Release v$(V) am $$(date +'%Y-%m-%d %H:%M') via Makefile"
	@echo "⚡ Pushe Tag v$(V) zu Forgejo..."
	git push origin v$(V)
	@echo "🎉 Version v$(V) erfolgreich an Forgejo übermittelt! Du kannst das Release jetzt im Browser aktivieren."


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


# 🔧 Komprimiert JS und CSS parallel über Docker – maximal optimiert
jsbuild:
	@echo "📦 Starte JS & CSS Bundling via Docker & esbuild..."
	@docker run --rm -v "$$(pwd)":/app -w /app node:20-alpine sh -c "\
		npx esbuild frontend/static/js/v2/main.js --bundle --minify --sourcemap --target=es2020 --outfile=frontend/static/js/v2/main.bundle.js && \
		npx esbuild frontend/static/css/style.css --minify --sourcemap --outfile=frontend/static/css/style.bundle.css"
	@echo "✅ Fertig! JS und CSS Bundles wurden erfolgreich im static-Ordner erstellt."

jsclean:
	@echo "🧼 Bereinige produktive Build-Dateien..."
	@rm -f frontend/static/js/app.bundle.js
	@rm -f frontend/static/js/app.bundle.js.map
	@rm -f frontend/static/css/style.bundle.css
	@rm -f frontend/static/css/style.bundle.css.map
	@echo "✨ Verzeichnis ist wieder sauber."


# ---------------------------------------------------------
# Help
# ---------------------------------------------------------
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
