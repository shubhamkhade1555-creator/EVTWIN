# EVTWIN Technical Documentation

**Status:** [PARTIALLY IMPLEMENTED] / [UNDER DEVELOPMENT]

## Project Experience Statement

> EVTWIN is being developed incrementally from an EV/IoT prototype toward a production-grade connected-vehicle platform. The project combines existing experience in Arduino/IoT development, MQTT communication, sensor data acquisition, MongoDB/backend integration, EV battery systems, MATLAB/Simulink modeling, and Digital Twin concepts. Components that have not yet been physically implemented or production-validated are documented as planned, proposed, simulated, or future capabilities rather than being represented as completed functionality.

## Core Documentation Rules

To ensure technical integrity and avoid false implementation claims, all documentation within this repository adheres to the following rules:

1.  **Mandatory Status Labels:** Every document clearly states its current implementation status (e.g., `[PROTOTYPE]`, `[PLANNED]`, `[SIMULATION]`, `[IMPLEMENTED]`).
2.  **Data Source Identifiers:** Telemetry schemas explicitly distinguish between real data (`source: "DEVICE"`) and non-real data (`source: "SIMULATION"`, `source: "MOCK"`, `source: "PREDICTED"`).
3.  **Experience vs Production Architecture:** Documents explicitly contrast the current prototype implementation against the recommended future production architecture.

## Documentation Index

### Architecture (`/architecture/`)
- [01-system-architecture.md](./architecture/01-system-architecture.md)
- [02-business-architecture.md](./architecture/02-business-architecture.md)
- [03-iot-architecture.md](./architecture/03-iot-architecture.md)
- [04-mqtt-architecture.md](./architecture/04-mqtt-architecture.md)
- [05-device-architecture.md](./architecture/05-device-architecture.md)
- [06-backend-architecture.md](./architecture/06-backend-architecture.md)
- [07-frontend-architecture.md](./architecture/07-frontend-architecture.md)
- [08-database-architecture.md](./architecture/08-database-architecture.md)
- [09-realtime-architecture.md](./architecture/09-realtime-architecture.md)
- [10-digital-twin-architecture.md](./architecture/10-digital-twin-architecture.md)
- [11-ml-architecture.md](./architecture/11-ml-architecture.md)
- [12-security-architecture.md](./architecture/12-security-architecture.md)
- [13-multi-tenancy-architecture.md](./architecture/13-multi-tenancy-architecture.md)
- [14-deployment-architecture.md](./architecture/14-deployment-architecture.md)

### API (`/api/`)
- [API-STANDARDS.md](./api/API-STANDARDS.md)
- [AUTH-API.md](./api/AUTH-API.md)
- [VEHICLE-API.md](./api/VEHICLE-API.md)
- [DEVICE-API.md](./api/DEVICE-API.md)
- [TELEMETRY-API.md](./api/TELEMETRY-API.md)
- [TRIP-API.md](./api/TRIP-API.md)
- [ALERT-API.md](./api/ALERT-API.md)
- [FAULT-API.md](./api/FAULT-API.md)
- [DIGITAL-TWIN-API.md](./api/DIGITAL-TWIN-API.md)

### IoT & Hardware (`/iot/`)
- [HARDWARE-CONNECTION.md](./iot/HARDWARE-CONNECTION.md)
- [SENSOR-SPECIFICATION.md](./iot/SENSOR-SPECIFICATION.md)
- [DEVICE-PROVISIONING.md](./iot/DEVICE-PROVISIONING.md)
- [MQTT-TOPICS.md](./iot/MQTT-TOPICS.md)
- [MQTT-PAYLOAD-SCHEMA.md](./iot/MQTT-PAYLOAD-SCHEMA.md)
- [TELEMETRY-SCHEMA.md](./iot/TELEMETRY-SCHEMA.md)
- [DEVICE-FIRMWARE-INTERFACE.md](./iot/DEVICE-FIRMWARE-INTERFACE.md)

### Database (`/database/`)
- [DATA-MODEL.md](./database/DATA-MODEL.md)
- [COLLECTIONS.md](./database/COLLECTIONS.md)
- [INDEXING.md](./database/INDEXING.md)
- [RETENTION-STRATEGY.md](./database/RETENTION-STRATEGY.md)

### Security (`/security/`)
- [SECURITY-ARCHITECTURE.md](./security/SECURITY-ARCHITECTURE.md)
- [AUTHENTICATION.md](./security/AUTHENTICATION.md)
- [RBAC.md](./security/RBAC.md)
- [DEVICE-SECURITY.md](./security/DEVICE-SECURITY.md)
- [MQTT-SECURITY.md](./security/MQTT-SECURITY.md)
- [AUDIT-LOGGING.md](./security/AUDIT-LOGGING.md)

### Testing (`/testing/`)
- [TEST-STRATEGY.md](./testing/TEST-STRATEGY.md)
- [UNIT-TESTING.md](./testing/UNIT-TESTING.md)
- [INTEGRATION-TESTING.md](./testing/INTEGRATION-TESTING.md)
- [E2E-TESTING.md](./testing/E2E-TESTING.md)
- [MQTT-TESTING.md](./testing/MQTT-TESTING.md)
- [HARDWARE-IN-LOOP.md](./testing/HARDWARE-IN-LOOP.md)
- [LOAD-TESTING.md](./testing/LOAD-TESTING.md)
- [SECURITY-TESTING.md](./testing/SECURITY-TESTING.md)

### Operations (`/operations/`)
- [OBSERVABILITY.md](./operations/OBSERVABILITY.md)
- [MONITORING.md](./operations/MONITORING.md)
- [LOGGING.md](./operations/LOGGING.md)
- [INCIDENT-RESPONSE.md](./operations/INCIDENT-RESPONSE.md)
- [DISASTER-RECOVERY.md](./operations/DISASTER-RECOVERY.md)
