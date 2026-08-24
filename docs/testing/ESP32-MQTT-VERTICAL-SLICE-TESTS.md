# EVTWIN Physical Vertical Slice: Hardware-to-Cloud Test Matrix

**Status:** [ACTIVE]
**Target:** ESP32 + DS18B20 Temperature Sensor Integration

This document serves as the formal acceptance testing protocol for the first physical vertical slice of the EVTWIN architecture. Do NOT simulate values. The `source` must remain `DEVICE`.

## Test Environment Prerequisites
1. Physical ESP32 Board connected via USB to PC.
2. Physical DS18B20 connected to 3.3V, GND, and GPIO 4 (with 4.7kΩ pull-up).
3. `firmware.ino` flashed with correct Wi-Fi and MQTT credentials.
4. `edge/ingestion_worker.py` running and connected to MQTT/MongoDB.
5. `apps/api/main.py` FastAPI backend running.
6. `apps/web` React frontend running.

---

## 1. Edge & IoT Tests (VS-001 to VS-006)

| Test ID | Description | Expected Result | Status |
|---|---|---|---|
| **VS-001** | ESP32 Boots successfully | Serial Monitor shows `EVTWIN firmware starting...` | [ ] |
| **VS-002** | DS18B20 Sensor Detected | Serial Monitor shows `Sensor: DS18B20` | [ ] |
| **VS-003** | Valid Temperature Read | Serial Monitor outputs `Temperature: X °C` (realistic value) | [ ] |
| **VS-004** | Wi-Fi Connects | Serial Monitor shows `Wi-Fi: CONNECTED` and IP address | [ ] |
| **VS-005** | MQTT Broker Connects | Serial Monitor shows MQTT `CONNECTED` | [ ] |
| **VS-006** | MQTT Payload Published | Serial Monitor shows `Publish: SUCCESS` | [ ] |

---

## 2. Ingestion & Cloud Tests (VS-007 to VS-010)

| Test ID | Description | Expected Result | Status |
|---|---|---|---|
| **VS-007** | Ingestion Receives Message | Worker log shows `Received Message on evtwin/...` | [ ] |
| **VS-008** | Telemetry Schema Validated | Worker verifies `source == "DEVICE"` and valid timestamp | [ ] |
| **VS-009** | MongoDB Persistence | Worker log shows `Persisted to MongoDB telemetry collection` | [ ] |
| **VS-010** | API Retrieval | `GET /vehicles/{vehicleId}/telemetry/latest` returns physical data | [ ] |

---

## 3. Frontend & End-to-End Tests (VS-011 to VS-020)

| Test ID | Description | Expected Result | Status |
|---|---|---|---|
| **VS-011** | Website Rendering | UI metric card shows the exact temperature value from API | [ ] |
| **VS-012** | Device Provenance Indicator | UI explicitly displays `DEVICE` and a live connection indicator | [ ] |
| **VS-013** | Timestamp Correctness | UI displays correct relative time (e.g., "just now") | [ ] |
| **VS-014** | Staleness Indicator | UI changes state to "DATA STALE" if no payload in >10 seconds | [ ] |
| **VS-015** | Wi-Fi Disconnect Recovery | Rebooting router causes temporary failure; auto-reconnects | [ ] |
| **VS-016** | MQTT Disconnect Recovery | Restarting Mosquitto causes failure; auto-reconnects | [ ] |
| **VS-017** | Sensor Failure Handling | Disconnecting sensor sets payload `quality = "INVALID"` | [ ] |
| **VS-018** | Malformed Message Rejection | Publishing invalid JSON manually is rejected by ingestion worker | [ ] |
| **VS-019** | Backend Unavailability | Stop FastAPI backend; Website shows UI error gracefully | [ ] |
| **VS-020** | **Physical E2E Test** | Safely warm sensor -> Serial changes -> API changes -> UI updates instantly | [ ] |

---
**Sign-off:**
*Ensure all boxes are marked `[x]` during physical execution phase.*
