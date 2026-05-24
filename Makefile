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

# ---------------------------------------------------------
# Help
# ---------------------------------------------------------
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
