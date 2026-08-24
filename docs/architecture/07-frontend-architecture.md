# 07 Frontend Architecture

**Status:** [PLANNED] / [UNDER DEVELOPMENT]

> Note: If this document conflicts with `MASTER-PRODUCT-SYSTEM-TRUTH.md`, the Master Truth takes precedence.

## 1. WHAT: Purpose of the Frontend
The EVTWIN frontend is not a generic React dashboard. It is an intelligent connected-EV platform designed to serve multiple distinct user personas. It translates raw engineering telemetry into actionable insights, alerts, and business intelligence without overwhelming the user.

## 2. WHO: Product Surfaces & Users
The UI dynamically adapts based on the authenticated persona:
- **Owner/Driver:** Needs safety alerts, range, SOC, and immediate trip status. Emphasizes simplicity.
- **Mechanic:** Needs diagnostic evidence, historical telemetry, and AI root-cause analysis.
- **Admin/Fleet:** Needs aggregate vehicle status, system health, and multi-tenant isolation.

## 3. HOW: Information Hierarchy (Progressive Disclosure)
To prevent cognitive overload, the UI follows a strict progressive disclosure hierarchy:
- **LEVEL 1 (Status):** Vehicle Status (e.g., "READY", "CHARGING").
- **LEVEL 2 (Telemetry):** Live values (e.g., Voltage: 48.2V, SOC: 78%).
- **LEVEL 3 (Diagnostics):** Engineering charts (e.g., Voltage vs Time).
- **LEVEL 4 (Digital Twin/AI):** "Battery Thermal Anomaly (Confidence 87%)".

## 4. AUTOMOTIVE HMI (Vehicle States)
The UI visually represents the vehicle's state machine:
`OFFLINE` → `ONLINE` → `READY` → `RUNNING` → `IDLE` (or `CHARGING` / `FAULT` / `SERVICE`).
Critical states like `FAULT` or `OFFLINE` trigger immediate UI notifications and halt live data rendering.

## 5. REAL-TIME UX & DATA INTEGRITY
Data flows from `MQTT → Backend → WebSocket → Frontend`.
The UI must explicitly render the freshness and source of the data. 
- **Freshness Labels:** `LIVE`, `RECENT`, `STALE`, `OFFLINE`.
- **Source Labels:** `MEASURED` (from physical device) vs `ESTIMATED` (from digital twin).
*Crucial Rule:* Never display stale or simulated telemetry as if it is live physical data.

## 6. AI & DIGITAL TWIN VISUALIZATION
When rendering AI predictions (e.g., Fault Detection):
- The AI must be explainable. It cannot just say "Battery is bad."
- It must output **Confidence** (e.g., 87%) and **Evidence** (e.g., "Current above expected profile").
- Digital Twin predictions must be visually distinct from measured physical sensor telemetry.

## 7. VALIDATION
The frontend is validated when the "Vertical Slice" is complete: One real temperature sensor change must reflect accurately on the UI via the complete MQTT/Backend pipeline.
