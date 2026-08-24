import os
import asyncio
import json
import logging
from datetime import datetime, timezone
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import paho.mqtt.client as mqtt
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ==========================================
# 1. SETUP & REAL MONGODB CONNECTION
# ==========================================
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("RealVerticalSlice")

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGO_DB_NAME = os.getenv("MONGODB_DATABASE", "evtwin")

try:
    db_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Trigger a connection test
    db_client.server_info()
    logger.info("Successfully connected to REAL MongoDB instance.")
except PyMongoError as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    # TEST-HW-004: We don't crash immediately, but subsequent DB ops will fail and be logged.

db = db_client[MONGO_DB_NAME]
telemetry_collection = db.telemetry

# ==========================================
# 2. FASTAPI BACKEND (The API Contract)
# ==========================================
app = FastAPI(title="EVTWIN Real Vertical Slice API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/vehicles/{vehicle_id}/telemetry/latest")
async def get_latest_telemetry(vehicle_id: str):
    try:
        record = telemetry_collection.find_one(
            {"vehicleId": vehicle_id},
            sort=[("receivedAt", -1)]
        )
        if not record:
            raise HTTPException(status_code=404, detail="No telemetry found")
        
        record["_id"] = str(record["_id"])
        return record
    except PyMongoError as e:
        logger.error(f"Database read failed: {e}")
        raise HTTPException(status_code=503, detail="Database Service Unavailable")

# ==========================================
# 3. MQTT INGESTION SERVICE (The MQTT Contract)
# ==========================================
MQTT_BROKER = "test.mosquitto.org"
MQTT_PORT = 1883
TOPIC = "evtwin/ORG001/EV001/telemetry"

def on_connect(client, userdata, flags, rc):
    logger.info(f"Ingestion Service connected to MQTT broker with result code {rc}")
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode("utf-8"))
        logger.info(f"Ingestion Service received Payload: {payload}")
        
        # Validation based on Master Truth rule: source must be DEVICE
        if payload.get("source") != "DEVICE":
            logger.warning("Payload rejected: Source is not DEVICE")
            return
            
        # Add server-side received timestamp (Timestamp Validation Rule 21)
        payload["receivedAt"] = datetime.now(timezone.utc).isoformat()
            
        # Store in REAL MongoDB
        try:
            result = telemetry_collection.insert_one(payload)
            logger.info(f"Stored real database record in MongoDB with ID: {result.inserted_id}")
        except PyMongoError as e:
            # TEST-HW-004: Persistence fails, system logs error, no false success
            logger.error(f"DATABASE PERSISTENCE FAILED: {e}")
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON received")
    except Exception as e:
        logger.error(f"Ingestion Error: {e}")

mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# ==========================================
# 4. RUNNER (No Simulated Edge Device)
# ==========================================
async def main():
    logger.info("Starting EVTWIN REAL Vertical Slice (Hardware Phase 4)...")
    logger.info("Waiting for physical hardware to publish to MQTT...")
    
    # Start MQTT loop in background thread
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_start()
    
    # Start FastAPI server
    config = uvicorn.Config(app, host="0.0.0.0", port=8001, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    asyncio.run(main())
