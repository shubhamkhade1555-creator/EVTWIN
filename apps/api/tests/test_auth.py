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

def test_login_all_five_roles():
    roles = [
        ("superadmin@evtwin.com", "SUPER_ADMIN"),
        ("owner@evtwin.com", "COMPANY_OWNER"),
        ("admin@evtwin.com", "COMPANY_ADMIN"),
        ("driver@evtwin.com", "DRIVER"),
        ("mechanic@evtwin.com", "MECHANIC"),
    ]
    
    for email, expected_role in roles:
        response = client.post("/api/v1/auth/login", json={"email": email, "password": "password123"})
        assert response.status_code == 200, f"Login failed for {email}: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["role"] == expected_role
        assert data["email"] == email

def test_invalid_login_password():
    response = client.post("/api/v1/auth/login", json={"email": "owner@evtwin.com", "password": "wrongpassword"})
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

def test_invalid_login_nonexistent_email():
    response = client.post("/api/v1/auth/login", json={"email": "nobody@evtwin.com", "password": "password123"})
    assert response.status_code == 401

def test_get_current_user_profile():
    # 1. Login
    login_res = client.post("/api/v1/auth/login", json={"email": "owner@evtwin.com", "password": "password123"})
    token = login_res.json()["access_token"]
    
    # 2. Query /auth/me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    user_data = me_res.json()
    assert user_data["email"] == "owner@evtwin.com"
    assert user_data["role"] == "COMPANY_OWNER"
    assert user_data["orgId"] == "ORG001"
