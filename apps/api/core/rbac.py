from typing import List, Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.security import decode_access_token
from core.database import get_db

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject identifier",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    db = get_db()
    user = db.users.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user record no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "userId": user.get("userId"),
        "email": user.get("email"),
        "role": user.get("role"),
        "orgId": user.get("orgId"),
        "name": user.get("name"),
        "assignedVehicleId": user.get("assignedVehicleId")
    }

def require_role(allowed_roles: List[str]):
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user.get("role")
        # SUPER_ADMIN has platform-wide superuser permissions
        if user_role == "SUPER_ADMIN":
            return current_user
        
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: Role '{user_role}' is not authorized for this operation. Required: {allowed_roles}",
            )
        return current_user
    return role_checker

def verify_tenant_access(current_user: Dict[str, Any], target_org_id: Optional[str]):
    # SUPER_ADMIN can access any tenant organization
    if current_user.get("role") == "SUPER_ADMIN":
        return True
    
    user_org = current_user.get("orgId")
    if not target_org_id or user_org != target_org_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cross-tenant access violation: You cannot access resources outside your organization.",
        )
    return True
