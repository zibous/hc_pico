# -*- coding: utf-8 -*-
"""Logging Setup."""

import logging
import os
from logging.handlers import RotatingFileHandler


def setup_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)

    key = os.getenv("LOG_LEVEL", "INFO").strip().upper()
    level_map = {"PRODUCTION": logging.WARNING, "VERBOSE": logging.DEBUG}
    level = level_map.get(key, getattr(logging, key, logging.INFO))
    logger.setLevel(level)

    logger.propagate = False
    if logger.hasHandlers():
        logger.handlers.clear()

    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    log_mode = os.getenv("LOG_MODE", "console").lower()

    if log_mode in ("file", "both"):
        os.makedirs("logs", exist_ok=True)
        file_handler = RotatingFileHandler(
            os.getenv("LOG_FILE", "logs/app.log"),
            maxBytes=int(os.getenv("LOG_MAX_BYTES", 1_000_000)),
            backupCount=int(os.getenv("LOG_BACKUP_COUNT", 3)),
            encoding="utf-8",
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    if log_mode in ("console", "both"):
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
    return logger
