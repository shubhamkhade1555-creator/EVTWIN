import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db
from core.security import get_password_hash
from core.rbac import require_role, get_current_user, verify_tenant_access
from models.schemas import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("", response_model=List[UserResponse])
def list_users(
    role: Optional[str] = None,
    current_user: dict = Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN"]))
):
    db = get_db()
    query = {}
    
    if current_user["role"] != "SUPER_ADMIN":
        query["orgId"] = current_user["orgId"]
    
    if role:
        query["role"] = role
        
    users = list(db.users.find(query, {"_id": 0, "passwordHash": 0}))
    return users

@router.post("", response_model=UserResponse, dependencies=[Depends(require_role(["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN"]))])
def create_user(req: UserCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    
    # Check if email already exists
    if db.users.find_one({"email": req.email}):
        raise HTTPException(status_code=400, detail="A user with this email address already exists.")
    
    # Determine target orgId
    target_org_id = req.orgId if current_user["role"] == "SUPER_ADMIN" else current_user["orgId"]
    
    user_id = f"USR_{uuid.uuid4().hex[:6].upper()}"
    new_user = {
        "userId": user_id,
        "email": req.email,
        "passwordHash": get_password_hash(req.password),
        "name": req.name,
        "role": req.role,
        "orgId": target_org_id,
        "assignedVehicleId": req.assignedVehicleId,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    db.users.insert_one(new_user)
    new_user.pop("_id", None)
    new_user.pop("passwordHash", None)
    return new_user
