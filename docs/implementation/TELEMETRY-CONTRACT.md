# TELEMETRY CONTRACT

**Status:** [FROZEN MVP CONTRACT]

## 1. WHAT: Purpose
This document defines the canonical JSON payload standard for all EVTWIN telemetry transmitted from the Edge Device to the Ingestion Backend. Any payload violating this contract must be quarantined.

## 2. SCHEMA DEFINITION (v1.0)
```json
{
  "schemaVersion": "1.0",
  "tenantId": "ORG001",
  "vehicleId": "EV001",
  "deviceId": "DEV001",
  "timestamp": "2026-08-23T15:20:10Z",
  "sequenceNumber": 123456,
  "source": "DEVICE",
  "quality": "VALID",

  "battery": {
    "voltage": 48.2,
    "current": 8.4,
    "temperature": 34.7,
    "soc": 78.5
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
}
```

## 3. FIELD RULES
- **timestamp (String):** Must be ISO-8601 UTC.
- **sequenceNumber (Integer):** Used for duplicate detection and ordering.
- **source (String):** MUST explicitly identify origin (`DEVICE`, `SIMULATION`, `MOCK`, `ESTIMATED`, `PREDICTED`).
- **quality (String):** MUST evaluate the data reliability (`VALID`, `INVALID`, `MISSING`, `STALE`).

## 4. UNITS & RANGES
- `voltage` (Volts) | Typical 48V architecture: Range [40.0 - 58.4]
- `current` (Amperes) | Range [-50.0 - 150.0]
- `temperature` (Celsius) | Range [-20.0 - 80.0]

*Any reading outside these ranges should trigger a `quality: INVALID` flag on the Edge before transmission.*
