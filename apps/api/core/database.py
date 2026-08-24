import logging
from datetime import datetime, timezone, timedelta
from typing import Any, Dict
import mongomock
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from core.config import settings
from core.security import get_password_hash

logger = logging.getLogger("EVTWIN-DB")

db_client: Any = None
db: Any = None

def init_db():
    global db_client, db
    
    if settings.IS_TESTING:
        logger.info("Initializing in-memory mongomock database for testing.")
        db_client = mongomock.MongoClient()
        db = db_client[settings.MONGODB_DATABASE]
        seed_default_data(db)
        return db

    try:
        real_client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
        real_client.server_info()
        logger.info("Successfully connected to physical/containerized MongoDB.")
        db_client = real_client
        db = db_client[settings.MONGODB_DATABASE]
    except Exception as e:
        logger.warning(f"Standalone MongoDB connection failed ({e}). Falling back to in-memory database.")
        db_client = mongomock.MongoClient()
        db = db_client[settings.MONGODB_DATABASE]
    
    seed_default_data(db)
    return db

def get_db():
    global db
    if db is None:
        init_db()
    return db

def seed_default_data(database):
    # 1. Organizations
    if database.organizations.count_documents({}) == 0:
        database.organizations.insert_many([
            {
                "orgId": "ORG001",
                "name": "Apex Logistics EV Fleet",
                "plan": "ENTERPRISE",
                "createdAt": datetime.now(timezone.utc).isoformat()
            },
            {
                "orgId": "ORG002",
                "name": "VoltFleet Urban Mobility",
                "plan": "PRO",
                "createdAt": datetime.now(timezone.utc).isoformat()
            }
        ])
        logger.info("Seeded default organizations.")

    # 2. Users (All 5 Roles with Acme Fleet and EVTWIN demo identities)
    default_hash = get_password_hash("password123")
    demo_users = [
        # Super Admin
        {
            "userId": "USR_SUPERADMIN",
            "email": "superadmin@evtwin.io",
            "passwordHash": get_password_hash("SuperAdmin123!"),
            "name": "Platform Super Admin",
            "role": "SUPER_ADMIN",
            "orgId": None,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "userId": "USR_SUPERADMIN_COM",
            "email": "superadmin@evtwin.com",
            "passwordHash": default_hash,
            "name": "Platform Super Admin",
            "role": "SUPER_ADMIN",
            "orgId": None,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        # Company Owner
        {
            "userId": "USR_OWNER",
            "email": "owner@acmefleet.com",
            "passwordHash": get_password_hash("Owner123!"),
            "name": "Marcus Vance (Fleet Owner)",
            "role": "COMPANY_OWNER",
            "orgId": "ORG001",
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "userId": "USR_OWNER_COM",
            "email": "owner@evtwin.com",
            "passwordHash": default_hash,
            "name": "Marcus Vance (Fleet Owner)",
            "role": "COMPANY_OWNER",
            "orgId": "ORG001",
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        # Company Admin
        {
            "userId": "USR_ADMIN",
            "email": "admin@acmefleet.com",
            "passwordHash": get_password_hash("Admin123!"),
            "name": "Sarah Connor (Fleet Operations Admin)",
            "role": "COMPANY_ADMIN",
            "orgId": "ORG001",
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "userId": "USR_ADMIN_COM",
            "email": "admin@evtwin.com",
            "passwordHash": default_hash,
            "name": "Sarah Connor (Fleet Operations Admin)",
            "role": "COMPANY_ADMIN",
            "orgId": "ORG001",
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        # Driver
        {
            "userId": "USR_DRIVER",
            "email": "driver@acmefleet.com",
            "passwordHash": get_password_hash("Driver123!"),
            "name": "Alex Mercer (Senior Fleet Driver)",
            "role": "DRIVER",
            "orgId": "ORG001",
            "assignedVehicleId": "EV001",
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "userId": "USR_DRIVER_COM",
            "email": "driver@evtwin.com",
            "passwordHash": default_hash,
            "name": "Alex Mercer (Senior Fleet Driver)",
            "role": "DRIVER",
            "orgId": "ORG001",
            "assignedVehicleId": "EV001",
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        # Mechanic
        {
            "userId": "USR_MECHANIC",
            "email": "mech@acmefleet.com",
            "passwordHash": get_password_hash("Mechanic123!"),
            "name": "David Miller (EV Specialist Mechanic)",
            "role": "MECHANIC",
            "orgId": "ORG001",
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "userId": "USR_MECHANIC_COM",
            "email": "mechanic@evtwin.com",
            "passwordHash": default_hash,
            "name": "David Miller (EV Specialist Mechanic)",
            "role": "MECHANIC",
            "orgId": "ORG001",
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
    ]
    for u in demo_users:
        database.users.update_one({"email": u["email"]}, {"$set": u}, upsert=True)
    logger.info("Upserted demo users across all 5 roles.")

    # 3. Vehicles
    if database.vehicles.count_documents({}) == 0:
        database.vehicles.insert_many([
            {
                "vehicleId": "EV001",
                "orgId": "ORG001",
                "vin": "EV-APEX-101",
                "make": "EVTWIN Alpha",
                "model": "Commercial Scooter 48V",
                "year": 2026,
                "status": "ONLINE",  # REGISTERED, DEVICE_ASSIGNED, ONLINE, READY, RUNNING, IDLE, OFFLINE, SERVICE, FAULT
                "batterySOC": 78.5,
                "batterySOH": 96.2,
                "odometer": 1420.5,
                "assignedDriverId": "USR_DRIVER",
                "assignedDeviceId": "DEV001",
                "lastHeartbeat": datetime.now(timezone.utc).isoformat()
            },
            {
                "vehicleId": "EV002",
                "orgId": "ORG001",
                "vin": "EV-APEX-102",
                "make": "EVTWIN Beta",
                "model": "Delivery Van 72V",
                "year": 2026,
                "status": "READY",
                "batterySOC": 92.0,
                "batterySOH": 98.5,
                "odometer": 3840.0,
                "assignedDriverId": None,
                "assignedDeviceId": "DEV002",
                "lastHeartbeat": datetime.now(timezone.utc).isoformat()
            },
            {
                "vehicleId": "EV003",
                "orgId": "ORG001",
                "vin": "EV-APEX-103",
                "make": "EVTWIN Alpha",
                "model": "Commercial Scooter 48V",
                "year": 2025,
                "status": "IDLE",
                "batterySOC": 45.0,
                "batterySOH": 91.0,
                "odometer": 5120.8,
                "assignedDriverId": None,
                "assignedDeviceId": "DEV003",
                "lastHeartbeat": datetime.now(timezone.utc).isoformat()
            },
            {
                "vehicleId": "EV004",
                "orgId": "ORG001",
                "vin": "EV-APEX-104",
                "make": "EVTWIN Cargo",
                "model": "Cargo Trike 48V",
                "year": 2025,
                "status": "SERVICE",
                "batterySOC": 18.0,
                "batterySOH": 84.5,
                "odometer": 7890.2,
                "assignedDriverId": None,
                "assignedDeviceId": "DEV004",
                "lastHeartbeat": datetime.now(timezone.utc).isoformat()
            }
        ])
        logger.info("Seeded default vehicles.")

    # 4. Devices
    if database.devices.count_documents({}) == 0:
        database.devices.insert_many([
            {
                "deviceId": "DEV001",
                "orgId": "ORG001",
                "vehicleId": "EV001",
                "hardwareVersion": "ESP32-WROOM-32D",
                "firmwareVersion": "v1.2.0",
                "connectivityStatus": "ONLINE",
                "lastSeen": datetime.now(timezone.utc).isoformat()
            },
            {
                "deviceId": "DEV002",
                "orgId": "ORG001",
                "vehicleId": "EV002",
                "hardwareVersion": "ESP32-WROOM-32D",
                "firmwareVersion": "v1.2.0",
                "connectivityStatus": "ONLINE",
                "lastSeen": datetime.now(timezone.utc).isoformat()
            },
            {
                "deviceId": "DEV003",
                "orgId": "ORG001",
                "vehicleId": "EV003",
                "hardwareVersion": "ESP32-WROOM-32D",
                "firmwareVersion": "v1.1.8",
                "connectivityStatus": "ONLINE",
                "lastSeen": datetime.now(timezone.utc).isoformat()
            },
            {
                "deviceId": "DEV004",
                "orgId": "ORG001",
                "vehicleId": "EV004",
                "hardwareVersion": "ESP32-WROOM-32D",
                "firmwareVersion": "v1.2.0",
                "connectivityStatus": "MAINTENANCE",
                "lastSeen": datetime.now(timezone.utc).isoformat()
            }
        ])
        logger.info("Seeded default devices.")

    # 5. Telemetry (Initial Records adhering to Contract v1.0)
    if database.telemetry.count_documents({}) == 0:
        now = datetime.now(timezone.utc)
        telemetry_records = []
        
        # Historical records for EV001 over past hour
        for i in range(12, -1, -1):
            ts = (now - timedelta(minutes=i*5)).isoformat()
            temp = 32.0 + (12 - i) * 0.25
            voltage = 48.8 - (12 - i) * 0.05
            soc = 82.0 - (12 - i) * 0.3
            telemetry_records.append({
                "schemaVersion": "1.0",
                "tenantId": "ORG001",
                "vehicleId": "EV001",
                "deviceId": "DEV001",
                "timestamp": ts,
                "receivedAt": ts,
                "sequenceNumber": 1000 + (12 - i),
                "source": "SIMULATION",
                "quality": "VALID",
                "battery": {
                    "voltage": round(voltage, 2),
                    "current": 8.4,
                    "temperature": round(temp, 1),
                    "soc": round(soc, 1)
                },
                "motor": {
                    "rpm": 1850,
                    "temperature": 42.3,
                    "current": 7.8
                },
                "vehicle": {
                    "speed": 31.4,
                    "latitude": 16.8523,
                    "longitude": 74.5815
                }
            })
        database.telemetry.insert_many(telemetry_records)
        logger.info("Seeded historical telemetry records.")

    # 6. Trips
    if database.trips.count_documents({}) == 0:
        now = datetime.now(timezone.utc)
        database.trips.insert_many([
            {
                "tripId": "TRIP-2026-001",
                "orgId": "ORG001",
                "vehicleId": "EV001",
                "driverId": "USR_DRIVER",
                "driverName": "Alex Mercer",
                "startTime": (now - timedelta(minutes=25)).isoformat(),
                "endTime": None,
                "status": "ACTIVE",
                "startSOC": 84.0,
                "endSOC": None,
                "distanceKm": 8.5,
                "energyKWh": 0.42,
                "avgSpeedKmH": 28.4,
                "startLocation": "Apex Central Hub",
                "destination": "North Distribution Depot"
            },
            {
                "tripId": "TRIP-2026-000",
                "orgId": "ORG001",
                "vehicleId": "EV001",
                "driverId": "USR_DRIVER",
                "driverName": "Alex Mercer",
                "startTime": (now - timedelta(hours=3, minutes=15)).isoformat(),
                "endTime": (now - timedelta(hours=2, minutes=30)).isoformat(),
                "status": "COMPLETED",
                "startSOC": 98.0,
                "endSOC": 85.0,
                "distanceKm": 16.2,
                "energyKWh": 0.78,
                "avgSpeedKmH": 32.1,
                "startLocation": "South Logistics Yard",
                "destination": "Apex Central Hub"
            }
        ])
        logger.info("Seeded default trips.")

    # 7. Alerts
    if database.alerts.count_documents({}) == 0:
        now = datetime.now(timezone.utc)
        database.alerts.insert_many([
            {
                "alertId": "ALT-2026-001",
                "orgId": "ORG001",
                "vehicleId": "EV004",
                "deviceId": "DEV004",
                "severity": "CRITICAL",
                "status": "IN_PROGRESS",  # NEW, ACKNOWLEDGED, IN_PROGRESS, RESOLVED
                "title": "High Battery Thermal Rise Detected",
                "description": "Battery pack temperature reached 51.4 °C exceeding 48.0 °C threshold under load.",
                "timestamp": (now - timedelta(hours=1, minutes=10)).isoformat(),
                "acknowledgedBy": "USR_ADMIN",
                "acknowledgedAt": (now - timedelta(minutes=50)).isoformat(),
                "evidence": {
                    "temperature": 51.4,
                    "voltage": 44.2,
                    "current": 38.5
                }
            },
            {
                "alertId": "ALT-2026-002",
                "orgId": "ORG001",
                "vehicleId": "EV001",
                "deviceId": "DEV001",
                "severity": "INFO",
                "status": "RESOLVED",
                "title": "Nominal Charging Cycle Started",
                "description": "Vehicle plugged into Level 2 charging dock. SOC at 78.5%.",
                "timestamp": (now - timedelta(hours=5)).isoformat(),
                "acknowledgedBy": "USR_DRIVER",
                "acknowledgedAt": (now - timedelta(hours=4, minutes=58)).isoformat(),
                "evidence": { "soc": 78.5 }
            }
        ])
        logger.info("Seeded default alerts.")

    # 8. Maintenance Tickets
    if database.maintenance.count_documents({}) == 0:
        now = datetime.now(timezone.utc)
        database.maintenance.insert_many([
            {
                "ticketId": "MNT-2026-101",
                "orgId": "ORG001",
                "vehicleId": "EV004",
                "associatedAlertId": "ALT-2026-001",
                "status": "IN_REPAIR",  # OPEN, ASSIGNED, INSPECTION, IN_REPAIR, COMPLETED, CANCELLED
                "priority": "HIGH",
                "title": "Battery Pack Thermal Inspection & Module Balancing",
                "assignedMechanicId": "USR_MECHANIC",
                "assignedMechanicName": "David Miller",
                "reportedAt": (now - timedelta(hours=1)).isoformat(),
                "notes": "Thermal paste inspection required on Module 2. High discharge current caused thermal delta of 6.2°C across cells.",
                "diagnosis": "Cell module 2 thermal pad degraded causing localized hot-spotting.",
                "repairAction": "Replaced thermal interface pad and verified passive cooling airflow.",
                "resolvedAt": None
            }
        ])
        logger.info("Seeded default maintenance records.")
