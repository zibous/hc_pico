#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
home-picokostal – Main Entry Point
====================================
Startet den Kostalcontroller und das FastAPI Dashboard parallel.
"""

import threading

from app.core.config import APP_NAME, APP_VERSION, HOST, PORT, INTERVALL
from app.core.logging import setup_logger
from app.services.controller import Kostalcontroller

log = setup_logger("main")


def start_dashboard():
    """Startet FastAPI/uvicorn als Background-Thread."""
    import uvicorn
    from app.api.server import create_app

    app = create_app()

    config = uvicorn.Config(
        app,
        host=HOST,
        port=PORT,
        log_level="warning",
    )
    server = uvicorn.Server(config)
    server.run()


def main():
    log.info("%s v%s starting", APP_NAME, APP_VERSION)

    dashboard_thread = threading.Thread(target=start_dashboard, daemon=True, name="dashboard")
    dashboard_thread.start()

    log.info("Dashboard gestartet auf Port %d", PORT)

    controller = Kostalcontroller(intervall=INTERVALL)
    controller.start_automatik()


if __name__ == "__main__":
    main()
