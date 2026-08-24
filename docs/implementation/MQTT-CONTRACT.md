# MQTT CONTRACT

**Status:** [FROZEN MVP CONTRACT]

## 1. WHAT: Purpose
Defines the edge-to-cloud communication protocol and topic structure for the EVTWIN platform.

## 2. TOPIC HIERARCHY
The system utilizes a strict topic structure for routing and access control:
`evtwin/{tenantId}/{vehicleId}/{topic}`

**MVP Core Topic:**
- `evtwin/{tenantId}/{vehicleId}/telemetry` (Publishes the JSON payload from the Telemetry Contract)

**Future / Planned Topics:**
- `evtwin/{tenantId}/{vehicleId}/status` (Device LWT/Status)
- `evtwin/{tenantId}/{vehicleId}/command` (Backend to Edge commands)

## 3. QUALITY OF SERVICE (QoS)
- MVP Telemetry operates at **QoS 1 (At least once)** to guarantee delivery while avoiding the overhead of QoS 2.
- The Ingestion Service must use the `sequenceNumber` to deduplicate payload ingestion.

## 4. SECURITY & ACL
- Production requires **MQTT over TLS (MQTTS)** on port 8883.
- **Tenant Isolation:** A device authenticated as `DEV001` belonging to `ORG001` is strictly authorized to publish *only* to `evtwin/ORG001/EV001/#`.
- Any attempt to publish to another tenant's namespace results in an immediate connection drop.

## 5. ERROR HANDLING
- **Offline Behavior:** Edge devices must implement a local buffer to store telemetry when the MQTT broker is unreachable, re-publishing buffered messages upon reconnection.
