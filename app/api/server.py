# -*- coding: utf-8 -*-
"""FastAPI App für Dashboard + API."""

import logging
import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# Modulare Routen-Imports
from app.api.routes.health import router as health_router
from app.api.routes.kpi import router as kpi_router
from app.api.routes.current import router as current_router
from app.api.routes.summary import router as summary_router
from app.api.routes.chart import router as chart_router
from app.api.routes.combined import router as combined_router

# Zentrale Konfiguration
from app.core.config import APP_NAME, APP_VERSION, KOSTAL_SENSOR, PROJECT_ROOT

log = logging.getLogger(__name__)
FRONTEND_DIR = PROJECT_ROOT / "frontend"

def create_app() -> FastAPI:
    app = FastAPI(
        title=APP_NAME,
        version=APP_VERSION,
        root_path=os.environ.get("ROOT_PATH", ""),
    )

    # --- Middleware: CORS ---
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Middleware: No-Cache für Web-Assets ---
    @app.middleware("http")
    async def add_no_cache_headers(request: Request, call_next):
        response = await call_next(request)
        if request.url.path.endswith((".html", ".js", ".css")):
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response

    # --- API Router Registrierung ---
    app.include_router(health_router, prefix="/api", tags=["health"])
    app.include_router(kpi_router, prefix="/api", tags=["kpi"])
    app.include_router(current_router, prefix="/api", tags=["current"])
    app.include_router(summary_router, prefix="/api", tags=["summary"])
    app.include_router(chart_router, prefix="/api", tags=["chart"])
    app.include_router(combined_router, prefix="/api", tags=["combined"])

    # --- Statische Dateien & Frontend Routen ---
    if (FRONTEND_DIR / "static").exists():
        app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR / "static")), name="static")

    @app.get("/", response_class=HTMLResponse)
    async def index():
        """Modulares Haupt-Dashboard."""
        html_file = FRONTEND_DIR / "dashboard.html"
        if html_file.exists():
            return FileResponse(str(html_file))
        return HTMLResponse("<h1>Dashboard not found</h1>", status_code=404)

    @app.get("/data/payload.json")
    async def payload_json():
        """Direkter Zugriff auf den letzten Polling-Zyklus des Wechselrichters."""
        data_file = Path(KOSTAL_SENSOR.get("datafile", "./data/payload.json"))
        if data_file.exists():
            return FileResponse(str(data_file))
        return JSONResponse({"error": "Keine Daten"}, status_code=404)

    return app
