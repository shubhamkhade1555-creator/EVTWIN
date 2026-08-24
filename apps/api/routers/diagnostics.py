from datetime import datetime, timezone
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db
from core.rbac import get_current_user, require_role, verify_tenant_access

router = APIRouter(prefix="/diagnostics", tags=["Diagnostics"])

@router.get("/vehicles/{vehicle_id}/evidence", dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN", "MECHANIC"]))])
def get_diagnostic_evidence(vehicle_id: str, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    db = get_db()
    vehicle = db.vehicles.find_one({"vehicleId": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    verify_tenant_access(current_user, vehicle.get("orgId"))
    
    # Retrieve recent telemetry traces
    traces = list(db.telemetry.find({"vehicleId": vehicle_id}).sort("timestamp", -1).limit(30))
    for t in traces:
        t.pop("_id", None)
        
    # Retrieve associated alerts
    alerts = list(db.alerts.find({"vehicleId": vehicle_id}).sort("timestamp", -1).limit(10))
    for a in alerts:
        a.pop("_id", None)
        
    # Retrieve maintenance history
    maintenance = list(db.maintenance.find({"vehicleId": vehicle_id}).sort("reportedAt", -1).limit(5))
    for m in maintenance:
        m.pop("_id", None)
        
    return {
        "vehicleId": vehicle_id,
        "orgId": vehicle.get("orgId"),
        "status": vehicle.get("status"),
        "batterySOC": vehicle.get("batterySOC"),
        "batterySOH": vehicle.get("batterySOH"),
        "recentTelemetryTraces": traces,
        "activeAlerts": alerts,
        "maintenanceHistory": maintenance,
        "digitalTwinState": {
            "modelStatus": "SIMULATION",
            "equivalentCircuitModel": "[PLANNED] 2-RC Thevenin Battery Network",
            "estimatedInternalResistance": "0.042 Ohm",
            "estimatedThermalGradient": "2.4 °C"
        }
    }
