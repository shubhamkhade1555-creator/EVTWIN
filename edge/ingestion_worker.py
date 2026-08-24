import os
import json
import logging
import asyncio
from datetime import datetime, timezone
import paho.mqtt.client as mqtt
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("IngestionWorker")

# MongoDB Config
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGO_DB_NAME = os.getenv("MONGODB_DATABASE", "evtwin")

# Fallback JSON store if MongoDB is down
FALLBACK_STORE = os.path.join(os.path.dirname(__file__), "..", "latest_telemetry.json")

# MQTT Config
MQTT_BROKER = os.getenv("MQTT_BROKER", "broker.hivemq.com")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "evtwin/+/+/telemetry")

use_mongodb = False
try:
    db_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db_client.server_info()
    logger.info("Successfully connected to MongoDB.")
    db = db_client[MONGO_DB_NAME]
    telemetry_collection = db.telemetry
    use_mongodb = True
except PyMongoError as e:
    logger.warning(f"Failed to connect to MongoDB, using JSON fallback store: {e}")

def on_connect(client, userdata, flags, rc):
    logger.info(f"Connected to MQTT broker {MQTT_BROKER} with result code {rc}")
    client.subscribe(MQTT_TOPIC)
    logger.info(f"Subscribed to topic: {MQTT_TOPIC}")

def on_message(client, userdata, msg):
    try:
        payload_str = msg.payload.decode("utf-8")
        payload = json.loads(payload_str)
        logger.info(f"Received Message on {msg.topic}: {payload}")
        
        # Validation 1: Source MUST be DEVICE
        if payload.get("source") != "DEVICE":
            logger.warning(f"Message rejected: Source is not DEVICE ({payload.get('source')})")
            return
            
        # Validation 2: Ensure valid timestamp exists
        if "timestamp" not in payload:
            payload["timestamp"] = datetime.now(timezone.utc).isoformat()
            
        # Add a server-side reception timestamp
        payload["receivedAt"] = datetime.now(timezone.utc).isoformat()
            
        if use_mongodb:
            result = telemetry_collection.insert_one(payload)
            logger.info(f"Persisted to MongoDB telemetry collection with ID: {result.inserted_id}")
        else:
            with open(FALLBACK_STORE, "w") as f:
                json.dump(payload, f)
            logger.info("Persisted to JSON fallback store.")
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON received.")
    except Exception as e:
        logger.error(f"Ingestion Worker Error: {e}")

def main():
    logger.info("Starting EVTWIN Physical Telemetry Ingestion Worker...")
    
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_forever()
    except KeyboardInterrupt:
        logger.info("Ingestion Worker shutting down...")
        client.disconnect()

if __name__ == "__main__":
    main()
