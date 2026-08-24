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

def test_trip_lifecycle_workflow():
    driver_token = get_token_for("driver@evtwin.com")
    
    # 1. Start a trip for EV002
    start_res = client.post(
        "/api/v1/trips/start",
        json={"vehicleId": "EV002", "startLocation": "South Yard", "destination": "North Station"},
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    assert start_res.status_code == 200
    trip = start_res.json()
    trip_id = trip["tripId"]
    assert trip["status"] == "ACTIVE"
    assert trip["driverId"] == "USR_DRIVER"
    
    # 2. Duplicate start should fail
    dup_res = client.post(
        "/api/v1/trips/start",
        json={"vehicleId": "EV002"},
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    assert dup_res.status_code == 400
    
    # 3. End the trip
    end_res = client.post(
        f"/api/v1/trips/{trip_id}/end",
        json={"endSOC": 79.5, "distanceKm": 12.4, "energyKWh": 0.65},
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    assert end_res.status_code == 200
    completed_trip = end_res.json()
    assert completed_trip["status"] == "COMPLETED"
    assert completed_trip["endSOC"] == 79.5
    assert completed_trip["distanceKm"] == 12.4

def test_alert_lifecycle_workflow():
    admin_token = get_token_for("admin@evtwin.com")
    
    # 1. Create alert
    create_res = client.post(
        "/api/v1/alerts",
        json={
            "vehicleId": "EV001",
            "severity": "WARNING",
            "title": "Abnormal Thermal Rise",
            "description": "Temperature increased 3.2°C over 60 seconds",
            "evidence": {"temperature": 46.8}
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert create_res.status_code == 200
    alert = create_res.json()
    alert_id = alert["alertId"]
    assert alert["status"] == "NEW"
    
    # 2. Acknowledge alert
    ack_res = client.post(
        f"/api/v1/alerts/{alert_id}/acknowledge",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert ack_res.status_code == 200
    assert ack_res.json()["status"] == "ACKNOWLEDGED"
    
    # 3. Resolve alert
    res_res = client.post(
        f"/api/v1/alerts/{alert_id}/resolve",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res_res.status_code == 200
    assert res_res.json()["status"] == "RESOLVED"

def test_maintenance_lifecycle_workflow():
    admin_token = get_token_for("admin@evtwin.com")
    mechanic_token = get_token_for("mechanic@evtwin.com")
    
    # 1. Create maintenance ticket for EV003
    create_res = client.post(
        "/api/v1/maintenance",
        json={
            "vehicleId": "EV003",
            "title": "Brake Regeneration Inspection",
            "priority": "MEDIUM",
            "assignedMechanicId": "USR_MECHANIC",
            "notes": "Driver reported slight delay in regen braking"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert create_res.status_code == 200
    ticket = create_res.json()
    ticket_id = ticket["ticketId"]
    assert ticket["status"] == "ASSIGNED"
    
    # 2. Mechanic diagnoses and updates ticket to IN_REPAIR
    diag_res = client.patch(
        f"/api/v1/maintenance/{ticket_id}",
        json={
            "status": "IN_REPAIR",
            "diagnosis": "Hall effect sensor calibration required",
            "repairAction": "Recalibrated throttle potentiometer and brake switch"
        },
        headers={"Authorization": f"Bearer {mechanic_token}"}
    )
    assert diag_res.status_code == 200
    assert diag_res.json()["status"] == "IN_REPAIR"
    
    # 3. Mechanic completes ticket
    done_res = client.patch(
        f"/api/v1/maintenance/{ticket_id}",
        json={"status": "COMPLETED"},
        headers={"Authorization": f"Bearer {mechanic_token}"}
    )
    assert done_res.status_code == 200
    assert done_res.json()["status"] == "COMPLETED"
    assert done_res.json()["resolvedAt"] is not None

def test_fleet_analytics():
    owner_token = get_token_for("owner@evtwin.com")
    res = client.get("/api/v1/analytics/fleet", headers={"Authorization": f"Bearer {owner_token}"})
    assert res.status_code == 200
    analytics = res.json()
    assert analytics["totalVehicles"] >= 4
    assert analytics["averageSOC"] > 0
    assert analytics["totalDistanceKm"] > 0
