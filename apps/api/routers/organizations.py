import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db
from core.rbac import require_role, get_current_user, verify_tenant_access
from models.schemas import OrganizationCreate, OrganizationResponse

router = APIRouter(prefix="/organizations", tags=["Organizations"])

@router.get("", response_model=List[OrganizationResponse])
def get_organizations(current_user: dict = Depends(get_current_user)):
    db = get_db()
    
    # Super Admin sees all organizations; others only see their own
    if current_user["role"] == "SUPER_ADMIN":
        orgs = list(database_orgs := db.organizations.find({}, {"_id": 0}))
    else:
        org_id = current_user.get("orgId")
        orgs = list(db.organizations.find({"orgId": org_id}, {"_id": 0}))
        
    return orgs

@router.post("", response_model=OrganizationResponse, dependencies=[Depends(require_role(["SUPER_ADMIN"]))])
def create_organization(req: OrganizationCreate):
    db = get_db()
    org_id = f"ORG_{uuid.uuid4().hex[:6].upper()}"
    new_org = {
        "orgId": org_id,
        "name": req.name,
        "plan": req.plan or "ENTERPRISE",
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    db.organizations.insert_one(new_org)
    new_org.pop("_id", None)
    return new_org
