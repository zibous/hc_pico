# -*- coding: utf-8 -*-
"""Health + AppStatus Routes."""

from fastapi import APIRouter

from app.core.config import APP_NAME, APP_VERSION, PORT, MQTT_SERVER

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "ok", "app": APP_NAME, "version": APP_VERSION}


@router.get("/appstatus")
async def appstatus():
    return {
        "app": APP_NAME,
        "version": APP_VERSION,
        "status": "ok",
        "port": PORT,
        "mqtt": {
            "broker": MQTT_SERVER["host"],
            "port": MQTT_SERVER["port"],
        },
    }
