import json
import logging
from datetime import datetime, timezone
from typing import Optional
import paho.mqtt.client as mqtt
from core.config import settings
from core.database import get_db

logger = logging.getLogger("EVTWIN-MQTT")

mqtt_client: Optional[mqtt.Client] = None

def validate_telemetry_payload(payload: dict) -> bool:
    required_keys = ["schemaVersion", "tenantId", "vehicleId", "deviceId", "timestamp", "sequenceNumber", "source", "quality", "battery"]
    for k in required_keys:
        if k not in payload:
            logger.warning(f"MQTT Ingestion: Missing required field '{k}' in payload")
            return False
            
    # Voltage, current, temperature range validation according to TELEMETRY-CONTRACT.md
    battery = payload.get("battery", {})
    if "temperature" not in battery or "voltage" not in battery:
        logger.warning("MQTT Ingestion: Missing battery temperature or voltage")
        return False
        
    return True

def process_rule_alerts(payload: dict):
    db = get_db()
    vehicle_id = payload.get("vehicleId")
    tenant_id = payload.get("tenantId")
    battery = payload.get("battery", {})
    temp = battery.get("temperature", 0.0)
    voltage = battery.get("voltage", 48.0)
    current = battery.get("current", 0.0)
    
    # Rule 1: High Temperature Critical Alert (> 50°C)
    if temp > 50.0:
        # Check if active alert already exists to prevent duplication
        existing = db.alerts.find_one({"vehicleId": vehicle_id, "title": "Critical Battery Thermal Excursion", "status": {"$in": ["NEW", "IN_PROGRESS", "ACKNOWLEDGED"]}})
        if not existing:
            now_str = datetime.now(timezone.utc).isoformat()
            db.alerts.insert_one({
                "alertId": f"ALT-THERM-{int(datetime.now().timestamp())}",
                "orgId": tenant_id,
                "vehicleId": vehicle_id,
                "deviceId": payload.get("deviceId"),
                "severity": "CRITICAL",
                "status": "NEW",
                "title": "Critical Battery Thermal Excursion",
                "description": f"Battery pack temperature reached {temp} °C under load.",
                "timestamp": now_str,
                "acknowledgedBy": None,
                "acknowledgedAt": None,
                "evidence": { "temperature": temp, "voltage": voltage, "current": current }
            })
            logger.warning(f"RULE TRIGGERED: Critical Thermal Alert created for vehicle {vehicle_id}")

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logger.info(f"MQTT Ingestion Service connected successfully to broker {settings.MQTT_BROKER}:{settings.MQTT_PORT}")
        client.subscribe(settings.MQTT_TOPIC_SUBSCRIPTION)
        logger.info(f"Subscribed to topic pattern: {settings.MQTT_TOPIC_SUBSCRIPTION}")
    else:
        logger.warning(f"MQTT connection failed with return code {rc}")

def on_message(client, userdata, msg):
    try:
        raw_payload = msg.payload.decode("utf-8")
        payload = json.loads(raw_payload)
        logger.debug(f"MQTT received on {msg.topic}: {payload}")
        
        if not validate_telemetry_payload(payload):
            logger.warning(f"Payload failed contract validation on topic {msg.topic}")
            return
            
        # Add server-side receivedAt timestamp
        payload["receivedAt"] = datetime.now(timezone.utc).isoformat()
        
        db = get_db()
        db.telemetry.insert_one(payload)
        
        # Update vehicle last heartbeat, status, and SOC
        db.vehicles.update_one(
            {"vehicleId": payload["vehicleId"]},
            {"$set": {
                "lastHeartbeat": payload["receivedAt"],
                "batterySOC": payload["battery"].get("soc", 80.0),
                "status": "ONLINE" if db.vehicles.find_one({"vehicleId": payload["vehicleId"], "status": "OFFLINE"}) else "RUNNING"
            }}
        )
        
        # Check rule alerts
        process_rule_alerts(payload)
        
    except json.JSONDecodeError:
        logger.error(f"MQTT Invalid JSON payload received on {msg.topic}")
    except Exception as e:
        logger.error(f"MQTT Ingestion processing error: {e}")

def start_mqtt_client():
    global mqtt_client
    try:
        mqtt_client = mqtt.Client()
        mqtt_client.on_connect = on_connect
        mqtt_client.on_message = on_message
        
        mqtt_client.connect_async(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
        mqtt_client.loop_start()
        logger.info("MQTT background loop started.")
    except Exception as e:
        logger.warning(f"Could not connect to MQTT broker ({e}). Telemetry API continues via simulation & REST.")

def stop_mqtt_client():
    global mqtt_client
    if mqtt_client:
        try:
            mqtt_client.loop_stop()
            mqtt_client.disconnect()
            logger.info("MQTT background loop stopped.")
        except Exception:
            pass
