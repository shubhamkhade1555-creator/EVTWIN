# DATABASE CONTRACT

**Status:** [FROZEN MVP CONTRACT]

## 1. WHAT: Purpose
Defines the primary MongoDB collections and schema boundaries for the initial MVP. We do not implement every future collection immediately to prevent architectural bloat.

## 2. MVP COLLECTIONS

### `organizations` (Tenants)
- `_id`: ObjectId
- `name`: String
- `createdAt`: ISODate

### `users`
- `_id`: ObjectId
- `organizationId`: ObjectId
- `email`: String
- `passwordHash`: String
- `role`: String (e.g., ADMIN, OWNER, DRIVER, MECHANIC)

### `vehicles`
- `_id`: ObjectId
- `organizationId`: ObjectId
- `registration`: String
- `status`: String (OFFLINE, ONLINE, READY)

### `devices`
- `_id`: ObjectId
- `vehicleId`: ObjectId
- `organizationId`: ObjectId
- `hardwareVersion`: String
- `connectivityStatus`: String

### `telemetry` (Time-Series target)
- `_id`: ObjectId
- `vehicleId`: ObjectId
- `deviceId`: ObjectId
- `timestamp`: ISODate
- `source`: String (MUST be DEVICE, SIMULATION, MOCK)
- `payload`: Object (Matches Telemetry Contract)

## 3. SCALING (Future)
Future phases will introduce Time-Series collections, Trip aggregations, Alerts, and Faults once the MVP Vertical Slice pipeline is fully validated.
