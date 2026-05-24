import logging
from datetime import datetime
from typing import Any, Dict, Optional

import requests

logger = logging.getLogger(__name__)


class Webhook:
    def __init__(self, base_url: str, webhook_id: str, timeout: int = 5):
        self.base_url = base_url.rstrip("/")
        self.webhook_id = webhook_id
        self.timeout = timeout

    @property
    def url(self) -> str:
        return f"{self.base_url}/api/webhook/{self.webhook_id}"

    def send(self, data: Optional[Dict[str, Any]] = None) -> bool:
        try:
            response = requests.post(
                self.url,
                json=data or {},
                timeout=self.timeout
            )
            response.raise_for_status()
            return True
        except requests.RequestException as e:
            logger.debug(f"Webhook send failed: {e}")
            return False


# Global helper – sends webhook if configured in .env
_webhook: Optional[Webhook] = None


def _get_webhook() -> Optional[Webhook]:
    """Lazy-init webhook from app_config."""
    global _webhook
    if _webhook is not None:
        return _webhook
    try:
        import app.core.config as app_config
        url = app_config.HA_WEBHOOK_URL
        wid = app_config.HA_WEBHOOK_ID
        if url and wid:
            _webhook = Webhook(base_url=url, webhook_id=wid)
            return _webhook
    except Exception:
        pass
    _webhook = None  # type: ignore
    return None


def notify_ha(event: str, **kwargs) -> bool:
    """Send a webhook event to Home Assistant (if configured).

    Usage:
        notify_ha("app_start", version="2.2.0")
        notify_ha("session_end", program="Max Effizient", energy_kwh=0.743)
        notify_ha("error", message="Device unreachable", severity="critical")
    """
    wh = _get_webhook()
    if not wh:
        return False
    try:
        import app.core.config as app_config
        payload: Dict[str, Any] = {
            "event": event,
            "device": app_config.APP_NAME,
            "timestamp": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        }
        payload.update(kwargs)
        ok = wh.send(payload)
        if ok:
            logger.debug(f"Webhook sent: {event}")
        return ok
    except Exception as e:
        logger.debug(f"Webhook error: {e}")
        return False