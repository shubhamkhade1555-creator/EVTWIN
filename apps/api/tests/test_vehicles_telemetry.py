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

def get_token_for(email: str = "owner@evtwin.com") -> str:
    res = client.post("/api/v1/auth/login", json={"email": email, "password": "password123"})
    return res.json()["access_token"]

def test_get_vehicles_list():
    token = get_token_for("owner@evtwin.com")
    res = client.get("/api/v1/vehicles", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    vehicles = res.json()
    assert len(vehicles) >= 4
    assert any(v["vehicleId"] == "EV001" for v in vehicles)

def test_get_latest_telemetry():
    token = get_token_for("owner@evtwin.com")
    res = client.get("/api/v1/vehicles/EV001/telemetry/latest", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["schemaVersion"] == "1.0"
    assert data["vehicleId"] == "EV001"
    assert data["source"] in ["SIMULATION", "DEVICE"]
    assert "battery" in data
    assert "temperature" in data["battery"]
    assert "voltage" in data["battery"]
    assert "soc" in data["battery"]

def test_simulate_telemetry_step():
    token = get_token_for("owner@evtwin.com")
    res = client.post("/api/v1/vehicles/EV001/telemetry/simulate", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["source"] == "SIMULATION"
    assert data["quality"] == "VALID"
    assert data["vehicleId"] == "EV001"

def test_telemetry_history():
    token = get_token_for("owner@evtwin.com")
    res = client.get("/api/v1/vehicles/EV001/telemetry/history?limit=10", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    history = res.json()
    assert isinstance(history, list)
    assert len(history) > 0
