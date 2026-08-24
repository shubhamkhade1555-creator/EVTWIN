import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db
from core.rbac import get_current_user, require_role, verify_tenant_access
from models.schemas import AlertCreate, AlertResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    query = {}
    
    if current_user["role"] != "SUPER_ADMIN":
        query["orgId"] = current_user["orgId"]
        
    if status:
        query["status"] = status
    if severity:
        query["severity"] = severity
        
    alerts = list(db.alerts.find(query, {"_id": 0}).sort("timestamp", -1))
    return alerts

@router.post("", response_model=AlertResponse, dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN", "MECHANIC"]))])
def create_alert(req: AlertCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    vehicle = db.vehicles.find_one({"vehicleId": req.vehicleId})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    verify_tenant_access(current_user, vehicle.get("orgId"))
    
    alert_id = f"ALT-{datetime.now().year}-{uuid.uuid4().hex[:4].upper()}"
    new_alert = {
        "alertId": alert_id,
        "orgId": vehicle.get("orgId"),
        "vehicleId": req.vehicleId,
        "deviceId": req.deviceId or vehicle.get("assignedDeviceId"),
        "severity": req.severity,
        "status": "NEW",
        "title": req.title,
        "description": req.description,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "acknowledgedBy": None,
        "acknowledgedAt": None,
        "evidence": req.evidence or {}
    }
    
    db.alerts.insert_one(new_alert)
    new_alert.pop("_id", None)
    return new_alert

@router.post("/{alert_id}/acknowledge", response_model=AlertResponse, dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN", "MECHANIC", "DRIVER"]))])
def acknowledge_alert(alert_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    alert = db.alerts.find_one({"alertId": alert_id})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    verify_tenant_access(current_user, alert.get("orgId"))
    
    db.alerts.update_one(
        {"alertId": alert_id},
        {"$set": {
            "status": "ACKNOWLEDGED",
            "acknowledgedBy": current_user["userId"],
            "acknowledgedAt": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    updated = db.alerts.find_one({"alertId": alert_id}, {"_id": 0})
    return updated

@router.post("/{alert_id}/resolve", response_model=AlertResponse, dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN", "MECHANIC"]))])
def resolve_alert(alert_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    alert = db.alerts.find_one({"alertId": alert_id})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    verify_tenant_access(current_user, alert.get("orgId"))
    
    db.alerts.update_one(
        {"alertId": alert_id},
        {"$set": {"status": "RESOLVED"}}
    )
    
    updated = db.alerts.find_one({"alertId": alert_id}, {"_id": 0})
    return updated
