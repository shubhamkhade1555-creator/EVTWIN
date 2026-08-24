import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db
from core.rbac import get_current_user, require_role, verify_tenant_access
from models.schemas import MaintenanceCreate, MaintenanceUpdateRequest, MaintenanceResponse

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.get("", response_model=List[MaintenanceResponse])
def get_maintenance_tickets(
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    query = {}
    
    if current_user["role"] == "MECHANIC":
        query["$or"] = [
            {"assignedMechanicId": current_user["userId"]},
            {"assignedMechanicId": None}
        ]
        query["orgId"] = current_user["orgId"]
    elif current_user["role"] != "SUPER_ADMIN":
        query["orgId"] = current_user["orgId"]
        
    if status:
        query["status"] = status
        
    tickets = list(db.maintenance.find(query, {"_id": 0}).sort("reportedAt", -1))
    return tickets

@router.post("", response_model=MaintenanceResponse, dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN", "MECHANIC", "DRIVER"]))])
def create_maintenance_ticket(req: MaintenanceCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    vehicle = db.vehicles.find_one({"vehicleId": req.vehicleId})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    verify_tenant_access(current_user, vehicle.get("orgId"))
    
    ticket_id = f"MNT-{datetime.now().year}-{uuid.uuid4().hex[:4].upper()}"
    new_ticket = {
        "ticketId": ticket_id,
        "orgId": vehicle.get("orgId"),
        "vehicleId": req.vehicleId,
        "associatedAlertId": req.associatedAlertId,
        "status": "OPEN" if not req.assignedMechanicId else "ASSIGNED",
        "priority": req.priority,
        "title": req.title,
        "assignedMechanicId": req.assignedMechanicId,
        "assignedMechanicName": None,
        "reportedAt": datetime.now(timezone.utc).isoformat(),
        "notes": req.notes,
        "diagnosis": None,
        "repairAction": None,
        "resolvedAt": None
    }
    
    # If a mechanic was specified, fetch name
    if req.assignedMechanicId:
        mech = db.users.find_one({"userId": req.assignedMechanicId})
        if mech:
            new_ticket["assignedMechanicName"] = mech.get("name")
            
    # Set vehicle to SERVICE status
    db.vehicles.update_one({"vehicleId": req.vehicleId}, {"$set": {"status": "SERVICE"}})
    
    db.maintenance.insert_one(new_ticket)
    new_ticket.pop("_id", None)
    return new_ticket

@router.patch("/{ticket_id}", response_model=MaintenanceResponse, dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN", "MECHANIC"]))])
def update_maintenance_ticket(ticket_id: str, req: MaintenanceUpdateRequest, current_user: dict = Depends(get_current_user)):
    db = get_db()
    ticket = db.maintenance.find_one({"ticketId": ticket_id})
    if not ticket:
        raise HTTPException(status_code=404, detail="Maintenance ticket not found")
        
    verify_tenant_access(current_user, ticket.get("orgId"))
    
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    
    # If resolving / completing
    if req.status == "COMPLETED":
        update_data["resolvedAt"] = datetime.now(timezone.utc).isoformat()
        # Restore vehicle status back to READY
        db.vehicles.update_one({"vehicleId": ticket["vehicleId"]}, {"$set": {"status": "READY"}})
        
    if req.assignedMechanicId and req.assignedMechanicId != ticket.get("assignedMechanicId"):
        mech = db.users.find_one({"userId": req.assignedMechanicId})
        if mech:
            update_data["assignedMechanicName"] = mech.get("name")
            
    if update_data:
        db.maintenance.update_one({"ticketId": ticket_id}, {"$set": update_data})
        
    updated = db.maintenance.find_one({"ticketId": ticket_id}, {"_id": 0})
    return updated
