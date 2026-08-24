# API CONTRACT

**Status:** [FROZEN MVP CONTRACT]

## 1. WHAT: Purpose
Defines the minimum required REST APIs to support the EVTWIN MVP frontend (the Vertical Slice). Do not implement APIs not defined here merely to increase endpoint count.

## 2. GENERAL RULES
- **Base Path:** `/api/v1/`
- **Authentication:** All routes (except login) require a valid JWT Bearer token.
- **Tenant Isolation:** The backend MUST validate that the requesting user's `organizationId` matches the requested resource.

## 3. MVP ENDPOINTS

### Authentication
- `POST /api/v1/auth/login`
  - *Returns:* JWT Access Token.

### Vehicles
- `POST /api/v1/vehicles`
  - *Description:* Provision a new vehicle for the tenant.
- `GET /api/v1/vehicles/:vehicleId`
  - *Description:* Retrieve vehicle details and state.

### Telemetry (The Vertical Slice endpoints)
- `GET /api/v1/vehicles/:vehicleId/telemetry/latest`
  - *Description:* Retrieves the single most recent telemetry payload for the Live Dashboard.
- `GET /api/v1/vehicles/:vehicleId/telemetry/history`
  - *Description:* Retrieves a time-bounded array of telemetry (e.g., last 1 hour) for basic charts.

## 4. FUTURE EXPANSION
Once the MVP is validated, endpoints for Trips (`/trips`), Alerts (`/alerts`), Diagnostics, and Digital Twin will be introduced.
