import pytest
import os
os.environ["IS_TESTING"] = "true"

from fastapi.testclient import TestClient
from main import app
from core.database import init_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_db():
    init_db()

def get_token_for(email: str) -> str:
    res = client.post("/api/v1/auth/login", json={"email": email, "password": "password123"})
    return res.json()["access_token"]

def test_super_admin_has_platform_health_access():
    token = get_token_for("superadmin@evtwin.com")
    res = client.get("/api/v1/admin/health", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["status"] == "HEALTHY"

def test_company_owner_forbidden_from_platform_health():
    token = get_token_for("owner@evtwin.com")
    res = client.get("/api/v1/admin/health", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 403
    assert "Access forbidden" in res.json()["detail"]

def test_driver_can_only_view_assigned_vehicle():
    token = get_token_for("driver@evtwin.com")
    # Driver assigned to EV001
    res_own = client.get("/api/v1/vehicles/EV001", headers={"Authorization": f"Bearer {token}"})
    assert res_own.status_code == 200
    
    # Driver attempts to access EV002 (should be 403)
    res_other = client.get("/api/v1/vehicles/EV002", headers={"Authorization": f"Bearer {token}"})
    assert res_other.status_code == 403

def test_mechanic_can_view_vehicles_and_update_maintenance():
    token = get_token_for("mechanic@evtwin.com")
    # Mechanic can view fleet vehicles
    res_veh = client.get("/api/v1/vehicles", headers={"Authorization": f"Bearer {token}"})
    assert res_veh.status_code == 200
    
    # Mechanic can view maintenance queue
    res_maint = client.get("/api/v1/maintenance", headers={"Authorization": f"Bearer {token}"})
    assert res_maint.status_code == 200
