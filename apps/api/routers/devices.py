from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db
from core.rbac import get_current_user, require_role, verify_tenant_access
from models.schemas import DeviceCreate, DeviceResponse

router = APIRouter(prefix="/devices", tags=["Devices"])

@router.get("", response_model=List[DeviceResponse])
def list_devices(current_user: dict = Depends(get_current_user)):
    db = get_db()
    query = {}
    if current_user["role"] != "SUPER_ADMIN":
        query["orgId"] = current_user["orgId"]
        
    devices = list(db.devices.find(query, {"_id": 0}))
    return devices

@router.post("", response_model=DeviceResponse, dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN"]))])
def provision_device(req: DeviceCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db.devices.find_one({"deviceId": req.deviceId}):
        raise HTTPException(status_code=400, detail="Device ID already provisioned")
        
    target_org_id = req.orgId if current_user["role"] == "SUPER_ADMIN" and req.orgId else current_user["orgId"]
    
    new_device = {
        "deviceId": req.deviceId,
        "orgId": target_org_id,
        "vehicleId": req.vehicleId,
        "hardwareVersion": req.hardwareVersion,
        "firmwareVersion": req.firmwareVersion,
        "connectivityStatus": "ONLINE",
        "lastSeen": datetime.now(timezone.utc).isoformat()
    }
    
    db.devices.insert_one(new_device)
    
    # If assigned to a vehicle, update vehicle status
    if req.vehicleId:
        db.vehicles.update_one(
            {"vehicleId": req.vehicleId},
            {"$set": {"assignedDeviceId": req.deviceId, "status": "DEVICE_ASSIGNED"}}
        )
        
    new_device.pop("_id", None)
    return new_device
