# -*- coding: utf-8 -*-
"""
MQTTClient
==========

Minimaler MQTT-Publisher (Exception-only).

Diese Klasse kapselt ausschließlich das Senden von MQTT-Nachrichten
über `paho.mqtt.publish.single()`.

"""

import json
import paho.mqtt.publish as publish

from app.core.logging import setup_logger


class MQTTClient:
    """
    Minimaler MQTT Publisher (Exception-only).

    Erfolg:
    --------
    - Kein Fehler → Publish erfolgreich

    Fehler:
    -------
    - Exception → Publish fehlgeschlagen
    """

    def __init__(
        self,
        host: str,
        port: int = 1883,
        clientId: str | None = None,
        auth: dict | None = None,
    ):
        """
        Initialisiert den MQTTClient.

        :param host: Hostname oder IP-Adresse des MQTT-Brokers
        :param port: MQTT-Port (Standard: 1883)
        :param client_id: MQTT Client-ID (optional)
        :param auth: Authentifizierungsdaten:
                     {"username": "...", "password": "..."} oder None
        :raises ValueError: wenn kein Host angegeben ist
        """
        if not host:
            raise ValueError("MQTT Broker Host darf nicht leer sein")

        self.logger = setup_logger(self.__class__.__name__)
        self.host = host
        self.port = port
        self.client_id: str = clientId or "piko_sensor"
        # paho-mqtt 2.x: auth ist einfach ein dict
        self.auth = auth

    def publish(
        self,
        payload,
        topic: str,
        qos: int = 0,
        retain: bool = True,
        keepalive: int = 60,
        loginfo: bool = True,
    ) -> None:
        """
        Publiziert eine Nachricht an ein MQTT-Topic.

        Erfolg:
        -------
        - Keine Exception → Nachricht wurde gesendet

        Fehler:
        -------
        - Wirft Exception bei:
          - Verbindungsproblemen
          - Authentifizierungsfehlern
          - JSON-Serialisierungsfehlern
          - ungültigem Topic

        :param payload: Beliebiges JSON-serialisierbares Objekt
        :param topic: MQTT-Topic
        :param qos: Quality of Service (0, 1 oder 2)
        :param retain: Retain-Flag
        :param keepalive: Keepalive-Zeit in Sekunden
        :raises ValueError: wenn Topic leer ist
        :raises Exception: bei jedem Publish-Fehler
        """

        if not topic:
            raise ValueError("MQTT Topic darf nicht leer sein")

        def json_converter(obj):
            """Fallback-Konverter für nicht JSON-kompatible Typen."""
            if isinstance(obj, set):
                return list(obj)
            return str(obj)

        try:
            payload_json = json.dumps(
                payload,
                default=json_converter,
                ensure_ascii=False,
            )

            publish.single(  # type: ignore[arg-type]
                topic=topic,
                payload=payload_json,
                qos=qos,
                retain=retain,
                hostname=self.host,
                port=self.port,
                client_id=self.client_id,
                keepalive=keepalive,
                auth=self.auth,  # type: ignore[arg-type]
            )
            if loginfo:
                self.logger.info("MQTT Publish erfolgreich: %s", topic)

        except Exception:
            self.logger.error(
                "MQTT Publish fehlgeschlagen (Topic=%s)",
                topic,
                exc_info=True,
            )
            raise
