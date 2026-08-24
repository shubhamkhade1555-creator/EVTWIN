from datetime import datetime
from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field

# ==========================================
# 1. AUTHENTICATION & USER SCHEMAS
# ==========================================
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    email: str
    organization_id: Optional[str] = None
    user_id: str
    name: str

class UserBase(BaseModel):
    email: str
    name: str
    role: Literal["SUPER_ADMIN", "COMPANY_OWNER", "COMPANY_ADMIN", "DRIVER", "MECHANIC"]
    orgId: Optional[str] = None
    assignedVehicleId: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    userId: str
    createdAt: str

# ==========================================
# 2. ORGANIZATION SCHEMAS
# ==========================================
class OrganizationCreate(BaseModel):
    name: str
    plan: Optional[str] = "ENTERPRISE"

class OrganizationResponse(BaseModel):
    orgId: str
    name: str
    plan: str
    createdAt: str

# ==========================================
# 3. VEHICLE SCHEMAS
# ==========================================
class VehicleBase(BaseModel):
    vin: str
    make: str
    model: str
    year: int
    orgId: str
    status: Literal["REGISTERED", "DEVICE_ASSIGNED", "ONLINE", "READY", "RUNNING", "IDLE", "OFFLINE", "SERVICE", "FAULT"] = "REGISTERED"
    batterySOC: float = Field(default=100.0, ge=0.0, le=100.0)
    batterySOH: float = Field(default=100.0, ge=0.0, le=100.0)
    odometer: float = Field(default=0.0, ge=0.0)
    assignedDriverId: Optional[str] = None
    assignedDeviceId: Optional[str] = None

class VehicleCreate(BaseModel):
    vin: str
    make: str
    model: str
    year: int
    orgId: Optional[str] = None
    assignedDeviceId: Optional[str] = None

class VehicleUpdate(BaseModel):
    status: Optional[Literal["REGISTERED", "DEVICE_ASSIGNED", "ONLINE", "READY", "RUNNING", "IDLE", "OFFLINE", "SERVICE", "FAULT"]] = None
    batterySOC: Optional[float] = None
    batterySOH: Optional[float] = None
    odometer: Optional[float] = None
    assignedDriverId: Optional[str] = None
    assignedDeviceId: Optional[str] = None

class VehicleResponse(VehicleBase):
    vehicleId: str
    lastHeartbeat: Optional[str] = None

# ==========================================
# 4. DEVICE SCHEMAS
# ==========================================
class DeviceCreate(BaseModel):
    deviceId: str
    vehicleId: Optional[str] = None
    orgId: Optional[str] = None
    hardwareVersion: str = "ESP32-WROOM-32D"
    firmwareVersion: str = "v1.2.0"

class DeviceResponse(BaseModel):
    deviceId: str
    orgId: str
    vehicleId: Optional[str] = None
    hardwareVersion: str
    firmwareVersion: str
    connectivityStatus: Literal["ONLINE", "OFFLINE", "MAINTENANCE"]
    lastSeen: str

# ==========================================
# 5. TELEMETRY CONTRACT (v1.0) SCHEMAS
# ==========================================
class BatteryTelemetry(BaseModel):
    voltage: float = Field(..., ge=40.0, le=58.4)
    current: float = Field(..., ge=-50.0, le=150.0)
    temperature: float = Field(..., ge=-20.0, le=80.0)
    soc: float = Field(..., ge=0.0, le=100.0)

class MotorTelemetry(BaseModel):
    rpm: int = Field(..., ge=0, le=6000)
    temperature: float = Field(..., ge=-20.0, le=120.0)
    current: float = Field(..., ge=0.0, le=150.0)

class VehiclePositionTelemetry(BaseModel):
    speed: float = Field(..., ge=0.0, le=140.0)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)

class TelemetryPayload(BaseModel):
    schemaVersion: str = "1.0"
    tenantId: str
    vehicleId: str
    deviceId: str
    timestamp: str
    sequenceNumber: int
    source: Literal["DEVICE", "SIMULATION", "MOCK", "ESTIMATED", "PREDICTED"] = "SIMULATION"
    quality: Literal["VALID", "INVALID", "MISSING", "STALE"] = "VALID"
    battery: BatteryTelemetry
    motor: Optional[MotorTelemetry] = None
    vehicle: Optional[VehiclePositionTelemetry] = None

class TelemetryResponse(TelemetryPayload):
    receivedAt: Optional[str] = None

# ==========================================
# 6. TRIP SCHEMAS
# ==========================================
class TripStartRequest(BaseModel):
    vehicleId: str
    startLocation: Optional[str] = "Fleet Hub"
    destination: Optional[str] = "Route Dispatch"

class TripEndRequest(BaseModel):
    endSOC: Optional[float] = None
    distanceKm: Optional[float] = None
    energyKWh: Optional[float] = None

class TripResponse(BaseModel):
    tripId: str
    orgId: str
    vehicleId: str
    driverId: str
    driverName: str
    startTime: str
    endTime: Optional[str] = None
    status: Literal["ACTIVE", "COMPLETED", "CANCELLED"]
    startSOC: float
    endSOC: Optional[float] = None
    distanceKm: float
    energyKWh: float
    avgSpeedKmH: float
    startLocation: str
    destination: str

# ==========================================
# 7. ALERT SCHEMAS
# ==========================================
class AlertCreate(BaseModel):
    vehicleId: str
    deviceId: Optional[str] = None
    severity: Literal["INFO", "WARNING", "CRITICAL", "EMERGENCY"]
    title: str
    description: str
    evidence: Optional[Dict[str, Any]] = None

class AlertResponse(BaseModel):
    alertId: str
    orgId: str
    vehicleId: str
    deviceId: Optional[str] = None
    severity: Literal["INFO", "WARNING", "CRITICAL", "EMERGENCY"]
    status: Literal["NEW", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED"]
    title: str
    description: str
    timestamp: str
    acknowledgedBy: Optional[str] = None
    acknowledgedAt: Optional[str] = None
    evidence: Optional[Dict[str, Any]] = None

# ==========================================
# 8. MAINTENANCE SCHEMAS
# ==========================================
class MaintenanceCreate(BaseModel):
    vehicleId: str
    associatedAlertId: Optional[str] = None
    title: str
    notes: Optional[str] = None
    priority: Literal["LOW", "MEDIUM", "HIGH", "EMERGENCY"] = "MEDIUM"
    assignedMechanicId: Optional[str] = None

class MaintenanceUpdateRequest(BaseModel):
    status: Optional[Literal["OPEN", "ASSIGNED", "INSPECTION", "IN_REPAIR", "COMPLETED", "CANCELLED"]] = None
    assignedMechanicId: Optional[str] = None
    diagnosis: Optional[str] = None
    repairAction: Optional[str] = None
    notes: Optional[str] = None

class MaintenanceResponse(BaseModel):
    ticketId: str
    orgId: str
    vehicleId: str
    associatedAlertId: Optional[str] = None
    status: Literal["OPEN", "ASSIGNED", "INSPECTION", "IN_REPAIR", "COMPLETED", "CANCELLED"]
    priority: Literal["LOW", "MEDIUM", "HIGH", "EMERGENCY"]
    title: str
    assignedMechanicId: Optional[str] = None
    assignedMechanicName: Optional[str] = None
    reportedAt: str
    notes: Optional[str] = None
    diagnosis: Optional[str] = None
    repairAction: Optional[str] = None
    resolvedAt: Optional[str] = None

# ==========================================
# 9. FLEET & PLATFORM ANALYTICS SCHEMAS
# ==========================================
class FleetAnalyticsResponse(BaseModel):
    orgId: str
    totalVehicles: int
    activeVehicles: int
    idleVehicles: int
    serviceVehicles: int
    offlineVehicles: int
    activeTrips: int
    averageSOC: float
    averageSOH: float
    totalDistanceKm: float
    criticalAlertsCount: int
    openMaintenanceCount: int
    timestamp: str

class PlatformHealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    services: Dict[str, str]
    database: Dict[str, Any]
    mqtt: Dict[str, Any]
