import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db
from core.rbac import get_current_user, require_role, verify_tenant_access
from models.schemas import VehicleCreate, VehicleUpdate, VehicleResponse

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("", response_model=List[VehicleResponse])
def get_vehicles(
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    query = {}
    
    # Super Admin has global visibility; Driver only sees their assigned vehicle
    if current_user["role"] == "DRIVER":
        assigned_id = current_user.get("assignedVehicleId")
        if assigned_id:
            query["vehicleId"] = assigned_id
        else:
            return []
    elif current_user["role"] != "SUPER_ADMIN":
        query["orgId"] = current_user["orgId"]
        
    if status:
        query["status"] = status
        
    vehicles = list(db.vehicles.find(query, {"_id": 0}))
    return vehicles

@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle_by_id(vehicle_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    vehicle = db.vehicles.find_one({"vehicleId": vehicle_id}, {"_id": 0})
    if not vehicle:
        raise HTTPException(status_code=404, detail=f"Vehicle {vehicle_id} not found")
        
    # Tenant verification
    verify_tenant_access(current_user, vehicle.get("orgId"))
    
    # Driver can only view their assigned vehicle
    if current_user["role"] == "DRIVER" and current_user.get("assignedVehicleId") != vehicle_id:
        raise HTTPException(status_code=403, detail="Driver is only permitted to access their assigned vehicle")
        
    return vehicle

@router.post("", response_model=VehicleResponse, dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN"]))])
def create_vehicle(req: VehicleCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    
    # Verify VIN uniqueness
    if db.vehicles.find_one({"vin": req.vin}):
        raise HTTPException(status_code=400, detail="A vehicle with this VIN already exists")
        
    target_org_id = req.orgId if current_user["role"] == "SUPER_ADMIN" and req.orgId else current_user["orgId"]
    vehicle_id = f"EV_{uuid.uuid4().hex[:6].upper()}"
    
    new_vehicle = {
        "vehicleId": vehicle_id,
        "orgId": target_org_id,
        "vin": req.vin,
        "make": req.make,
        "model": req.model,
        "year": req.year,
        "status": "REGISTERED" if not req.assignedDeviceId else "DEVICE_ASSIGNED",
        "batterySOC": 100.0,
        "batterySOH": 100.0,
        "odometer": 0.0,
        "assignedDriverId": None,
        "assignedDeviceId": req.assignedDeviceId,
        "lastHeartbeat": datetime.now(timezone.utc).isoformat()
    }
    
    db.vehicles.insert_one(new_vehicle)
    new_vehicle.pop("_id", None)
    return new_vehicle

@router.patch("/{vehicle_id}", response_model=VehicleResponse, dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN", "MECHANIC"]))])
def update_vehicle(vehicle_id: str, req: VehicleUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    vehicle = db.vehicles.find_one({"vehicleId": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    verify_tenant_access(current_user, vehicle.get("orgId"))
    
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    if update_data:
        db.vehicles.update_one({"vehicleId": vehicle_id}, {"$set": update_data})
        
    updated = db.vehicles.find_one({"vehicleId": vehicle_id}, {"_id": 0})
    return updated
