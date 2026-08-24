from datetime import datetime, timezone, timedelta
import json
import os
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from core.database import get_db
from core.rbac import get_current_user, verify_tenant_access
from models.schemas import TelemetryPayload, TelemetryResponse
from services.simulation_service import simulator

router = APIRouter(prefix="/vehicles", tags=["Telemetry"])

FALLBACK_STORE = os.path.join(os.path.dirname(__file__), "..", "..", "..", "latest_telemetry.json")

@router.get("/{vehicle_id}/telemetry/latest", response_model=TelemetryResponse)
def get_latest_telemetry(vehicle_id: str, current_user: dict = Depends(get_current_user)):
    try:
        db = get_db()
        vehicle = db.vehicles.find_one({"vehicleId": vehicle_id})
    except Exception:
        vehicle = None
        
    if not vehicle:
        # For prototype/fallback when MongoDB is down
        vehicle = {"orgId": "ORG001", "assignedDeviceId": "DEV001"}
        
    verify_tenant_access(current_user, vehicle.get("orgId"))
    
    record = None
    try:
        if db:
            record = db.telemetry.find_one(
                {"vehicleId": vehicle_id},
                sort=[("timestamp", -1)]
            )
    except Exception:
        record = None

    if not record and os.path.exists(FALLBACK_STORE):
        try:
            with open(FALLBACK_STORE, "r") as f:
                record = json.load(f)
                if record.get("vehicleId") != vehicle_id:
                    record = None
        except Exception:
            pass
    
    if not record:
        raise HTTPException(status_code=404, detail="No telemetry data available for this vehicle")
        
    record.pop("_id", None)
    return record

@router.get("/{vehicle_id}/telemetry/history", response_model=List[TelemetryResponse])
def get_telemetry_history(
    vehicle_id: str,
    limit: int = Query(default=20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    vehicle = db.vehicles.find_one({"vehicleId": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    verify_tenant_access(current_user, vehicle.get("orgId"))
    
    cursor = db.telemetry.find({"vehicleId": vehicle_id}).sort("timestamp", -1).limit(limit)
    records = list(cursor)
    records.reverse()
    for r in records:
        r.pop("_id", None)
        
    return records

@router.post("/{vehicle_id}/telemetry/simulate", response_model=TelemetryResponse)
def simulate_telemetry_step(vehicle_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    vehicle = db.vehicles.find_one({"vehicleId": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    verify_tenant_access(current_user, vehicle.get("orgId"))
    
    payload = simulator.step_signals(
        vehicle_id=vehicle_id,
        org_id=vehicle.get("orgId", "ORG001"),
        device_id=vehicle.get("assignedDeviceId", "DEV001") if "assignedDeviceId" in vehicle else "DEV001"
    )
    return payload
