import asyncio
import json
import logging
from datetime import datetime, timezone
import mongomock
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import paho.mqtt.client as mqtt

# ==========================================
# 1. SETUP & MOCK MONGODB (The Database Contract)
# ==========================================
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("VerticalSlice")

db_client = mongomock.MongoClient()
db = db_client.evtwin
telemetry_collection = db.telemetry

# ==========================================
# 2. FASTAPI BACKEND (The API Contract)
# ==========================================
app = FastAPI(title="EVTWIN Vertical Slice API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/vehicles/{vehicle_id}/telemetry/latest")
async def get_latest_telemetry(vehicle_id: str):
    record = telemetry_collection.find_one(
        {"vehicleId": vehicle_id},
        sort=[("timestamp", -1)]
    )
    if not record:
        raise HTTPException(status_code=404, detail="No telemetry found")
    
    # Remove MongoDB ObjectId for JSON serialization
    record["_id"] = str(record["_id"])
    return record

# ==========================================
# 3. MQTT INGESTION SERVICE (The MQTT & Telemetry Contract)
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
        logger.info(f"Ingestion Service received MQTT Payload: {payload}")
        
        # Validation based on Master Truth rule: source must be DEVICE
        if payload.get("source") != "DEVICE":
            logger.warning("Payload rejected: Source is not DEVICE")
            return
            
        # Store in MongoDB (Mock)
        result = telemetry_collection.insert_one(payload)
        logger.info(f"Stored one database record in MongoDB with ID: {result.inserted_id}")
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON received")
    except Exception as e:
        logger.error(f"Ingestion Error: {e}")

mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# ==========================================
# 4. EDGE DEVICE SIMULATION (Hardware Sensor)
# ==========================================
async def simulate_edge_device():
    """Simulates the physical Arduino/ESP32 reading a temperature sensor and publishing to MQTT."""
    logger.info("Starting Edge Device Simulation...")
    seq = 0
    temp = 34.0
    while True:
        await asyncio.sleep(5)  # Publish every 5 seconds
        
        # Telemetry Contract Payload
        payload = {
            "schemaVersion": "1.0",
            "tenantId": "ORG001",
            "vehicleId": "EV001",
            "deviceId": "DEV001",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "sequenceNumber": seq,
            "source": "DEVICE",
            "quality": "VALID",
            "battery": {
                "temperature": round(temp, 1)
            }
        }
        
        mqtt_client.publish(TOPIC, json.dumps(payload))
        logger.info(f"Edge Device published temperature: {temp:.1f} °C")
        
        seq += 1
        temp += 0.5  # Simulate temperature rising
        if temp > 45.0:
            temp = 34.0

# ==========================================
# 5. RUNNER
# ==========================================
async def main():
    logger.info("Starting EVTWIN Vertical Slice (Rule 67)...")
    
    # Start MQTT loop in background thread
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_start()
    
    # Start Edge Device simulation task
    asyncio.create_task(simulate_edge_device())
    
    # Start FastAPI server
    config = uvicorn.Config(app, host="127.0.0.1", port=8000, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    asyncio.run(main())
