import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db
from core.rbac import get_current_user, require_role, verify_tenant_access
from models.schemas import TripStartRequest, TripEndRequest, TripResponse

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("", response_model=List[TripResponse])
def get_trips(
    vehicle_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    query = {}
    
    if current_user["role"] == "DRIVER":
        query["driverId"] = current_user["userId"]
    elif current_user["role"] != "SUPER_ADMIN":
        query["orgId"] = current_user["orgId"]
        
    if vehicle_id:
        query["vehicleId"] = vehicle_id
        
    trips = list(db.trips.find(query, {"_id": 0}).sort("startTime", -1))
    return trips

@router.post("/start", response_model=TripResponse, dependencies=[Depends(require_role(["DRIVER", "COMPANY_ADMIN", "COMPANY_OWNER"]))])
def start_trip(req: TripStartRequest, current_user: dict = Depends(get_current_user)):
    db = get_db()
    
    # Check if vehicle exists
    vehicle = db.vehicles.find_one({"vehicleId": req.vehicleId})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    verify_tenant_access(current_user, vehicle.get("orgId"))
    
    # Check if an active trip already exists for this vehicle
    existing = db.trips.find_one({"vehicleId": req.vehicleId, "status": "ACTIVE"})
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle already has an active trip in progress")
        
    trip_id = f"TRIP-{datetime.now().year}-{uuid.uuid4().hex[:4].upper()}"
    start_soc = vehicle.get("batterySOC", 90.0)
    
    new_trip = {
        "tripId": trip_id,
        "orgId": vehicle.get("orgId"),
        "vehicleId": req.vehicleId,
        "driverId": current_user["userId"],
        "driverName": current_user.get("name", "Driver"),
        "startTime": datetime.now(timezone.utc).isoformat(),
        "endTime": None,
        "status": "ACTIVE",
        "startSOC": start_soc,
        "endSOC": None,
        "distanceKm": 0.0,
        "energyKWh": 0.0,
        "avgSpeedKmH": 0.0,
        "startLocation": req.startLocation or "Fleet Hub",
        "destination": req.destination or "Dispatched Route"
    }
    
    db.trips.insert_one(new_trip)
    
    # Update vehicle status to RUNNING
    db.vehicles.update_one({"vehicleId": req.vehicleId}, {"$set": {"status": "RUNNING"}})
    
    new_trip.pop("_id", None)
    return new_trip

@router.post("/{trip_id}/end", response_model=TripResponse, dependencies=[Depends(require_role(["DRIVER", "COMPANY_ADMIN", "COMPANY_OWNER"]))])
def end_trip(trip_id: str, req: TripEndRequest, current_user: dict = Depends(get_current_user)):
    db = get_db()
    trip = db.trips.find_one({"tripId": trip_id})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip record not found")
        
    if trip["status"] != "ACTIVE":
        raise HTTPException(status_code=400, detail="Trip is not in ACTIVE state")
        
    verify_tenant_access(current_user, trip.get("orgId"))
    
    end_time = datetime.now(timezone.utc).isoformat()
    end_soc = req.endSOC if req.endSOC is not None else max(0.0, trip["startSOC"] - 12.5)
    distance = req.distanceKm if req.distanceKm is not None else 14.8
    energy = req.energyKWh if req.energyKWh is not None else 0.72
    avg_speed = 32.5
    
    db.trips.update_one(
        {"tripId": trip_id},
        {"$set": {
            "endTime": end_time,
            "status": "COMPLETED",
            "endSOC": end_soc,
            "distanceKm": distance,
            "energyKWh": energy,
            "avgSpeedKmH": avg_speed
        }}
    )
    
    # Update vehicle status back to READY and update SOC & odometer
    db.vehicles.update_one(
        {"vehicleId": trip["vehicleId"]},
        {
            "$set": {"status": "READY", "batterySOC": end_soc},
            "$inc": {"odometer": distance}
        }
    )
    
    updated_trip = db.trips.find_one({"tripId": trip_id}, {"_id": 0})
    return updated_trip
