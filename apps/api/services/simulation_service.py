import asyncio
import logging
from datetime import datetime, timezone
import random
from core.database import get_db
from services.mqtt_service import process_rule_alerts

logger = logging.getLogger("EVTWIN-Simulator")

class TelemetrySimulator:
    def __init__(self):
        self.running = False
        self.seq = 2000
        self.current_temp = 34.5
        self.current_voltage = 48.4
        self.current_soc = 78.5
        self.speed = 32.0
        self.rpm = 1880
        
    def step_signals(self, vehicle_id: str = "EV001", org_id: str = "ORG001", device_id: str = "DEV001") -> dict:
        self.seq += 1
        
        # Correlated physics signals:
        # Load causes voltage drop and temperature rise
        load_jitter = random.uniform(-0.5, 0.8)
        self.speed = max(0.0, min(65.0, self.speed + random.uniform(-1.5, 1.8)))
        self.rpm = int(self.speed * 58.5)
        
        current = round(4.0 + (self.speed / 65.0) * 22.0 + load_jitter, 2)
        power_w = round(self.current_voltage * current, 1)
        
        # Temperature rises slowly under continuous load, dissipates when idle
        if current > 12.0:
            self.current_temp = min(58.0, self.current_temp + 0.15)
        else:
            self.current_temp = max(30.0, self.current_temp - 0.08)
            
        self.current_soc = max(5.0, self.current_soc - 0.02)
        self.current_voltage = round(44.0 + (self.current_soc / 100.0) * 6.5 - (current * 0.04), 2)
        
        now_ts = datetime.now(timezone.utc).isoformat()
        
        payload = {
            "schemaVersion": "1.0",
            "tenantId": org_id,
            "vehicleId": vehicle_id,
            "deviceId": device_id,
            "timestamp": now_ts,
            "receivedAt": now_ts,
            "sequenceNumber": self.seq,
            "source": "SIMULATION",
            "quality": "VALID",
            "battery": {
                "voltage": round(self.current_voltage, 2),
                "current": round(current, 2),
                "temperature": round(self.current_temp, 1),
                "soc": round(self.current_soc, 1)
            },
            "motor": {
                "rpm": self.rpm,
                "temperature": round(self.current_temp + 6.4, 1),
                "current": round(current * 0.92, 2)
            },
            "vehicle": {
                "speed": round(self.speed, 1),
                "latitude": round(16.8523 + (self.seq * 0.0001), 4),
                "longitude": round(74.5815 + (self.seq * 0.0001), 4)
            }
        }
        
        db = get_db()
        db.telemetry.insert_one(payload)
        
        # Update vehicle current SOC and heartbeat
        db.vehicles.update_one(
            {"vehicleId": vehicle_id},
            {"$set": {
                "batterySOC": payload["battery"]["soc"],
                "lastHeartbeat": now_ts,
                "status": "RUNNING" if self.speed > 5.0 else "ONLINE"
            }}
        )
        
        # Check rule alerts
        process_rule_alerts(payload)
        
        payload.pop("_id", None)
        return payload

simulator = TelemetrySimulator()
