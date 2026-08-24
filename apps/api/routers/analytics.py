from datetime import datetime, timezone
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db
from core.rbac import get_current_user, require_role, verify_tenant_access
from models.schemas import FleetAnalyticsResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/fleet", response_model=FleetAnalyticsResponse, dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN"]))])
def get_fleet_analytics(current_user: dict = Depends(get_current_user)):
    db = get_db()
    org_id = current_user.get("orgId") or "ORG001"
    
    query = {} if current_user["role"] == "SUPER_ADMIN" else {"orgId": org_id}
    
    vehicles = list(db.vehicles.find(query))
    total_vehicles = len(vehicles)
    active_vehicles = sum(1 for v in vehicles if v.get("status") in ["RUNNING", "ONLINE", "READY"])
    idle_vehicles = sum(1 for v in vehicles if v.get("status") == "IDLE")
    service_vehicles = sum(1 for v in vehicles if v.get("status") == "SERVICE")
    offline_vehicles = sum(1 for v in vehicles if v.get("status") == "OFFLINE")
    
    avg_soc = sum(v.get("batterySOC", 0.0) for v in vehicles) / total_vehicles if total_vehicles > 0 else 0.0
    avg_soh = sum(v.get("batterySOH", 0.0) for v in vehicles) / total_vehicles if total_vehicles > 0 else 0.0
    total_distance = sum(v.get("odometer", 0.0) for v in vehicles)
    
    trip_query = {"status": "ACTIVE"} if current_user["role"] == "SUPER_ADMIN" else {"orgId": org_id, "status": "ACTIVE"}
    active_trips = db.trips.count_documents(trip_query)
    
    alert_query = {"severity": "CRITICAL", "status": {"$ne": "RESOLVED"}} if current_user["role"] == "SUPER_ADMIN" else {"orgId": org_id, "severity": "CRITICAL", "status": {"$ne": "RESOLVED"}}
    critical_alerts = db.alerts.count_documents(alert_query)
    
    maint_query = {"status": {"$ne": "COMPLETED"}} if current_user["role"] == "SUPER_ADMIN" else {"orgId": org_id, "status": {"$ne": "COMPLETED"}}
    open_maint = db.maintenance.count_documents(maint_query)
    
    return {
        "orgId": org_id,
        "totalVehicles": total_vehicles,
        "activeVehicles": active_vehicles,
        "idleVehicles": idle_vehicles,
        "serviceVehicles": service_vehicles,
        "offlineVehicles": offline_vehicles,
        "activeTrips": active_trips,
        "averageSOC": round(avg_soc, 1),
        "averageSOH": round(avg_soh, 1),
        "totalDistanceKm": round(total_distance, 1),
        "criticalAlertsCount": critical_alerts,
        "openMaintenanceCount": open_maint,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
