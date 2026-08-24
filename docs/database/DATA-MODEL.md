# Database Data Model

**Status:** [PROTOTYPE]

## Purpose
Defines the MongoDB entity architecture for the EVTWIN platform.

## EVTWIN Context & Components
MongoDB collections are optimized for IoT telemetry and multi-tenant isolation.
- `organizations`
- `users`
- `vehicles`
- `devices`
- `telemetry` (Time-series)
- `faults`

## Dependencies & Validation
- Telemetry insertion validates `source` matches `DEVICE`, `SIMULATION`, or `MOCK`.
- Schema validation via backend API.

## Security & Tenant Isolation
- Every query MUST filter by `organizationId`.
- No cross-tenant aggregations allowed outside of isolated admin processes.
