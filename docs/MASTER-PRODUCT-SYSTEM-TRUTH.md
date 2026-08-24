# EVTWIN — MASTER PRODUCT, SYSTEM & ENGINEERING TRUTH

> If any other documentation conflicts with MASTER-PRODUCT-SYSTEM-TRUTH.md, the Master Truth takes precedence until the conflict is explicitly resolved.

## PURPOSE OF THIS DOCUMENT

This document is the **single source of truth for understanding what EVTWIN actually is, what we are building, how it works, what technologies are used, how data moves through the system, how users interact with it, how the physical EV connects to the platform, how the Digital Twin works, how faults are detected, and how the system evolves from prototype to enterprise production platform.**

Any technical documentation, architecture document, API specification, database schema, frontend design, backend implementation, IoT implementation, testing strategy, or future product decision must be derived from this specification.

Do not generate generic IoT/SaaS documentation.
Do not assume this is a generic dashboard.
Do not reduce EVTWIN to:
> "Sensors → MQTT → MongoDB → Website."
That is only one part of the system.

EVTWIN is a **connected electric-vehicle intelligence platform combining physical vehicle telemetry, IoT connectivity, vehicle Black Box capabilities, Digital Twin modeling, AI/ML diagnostics, real-time visualization, trip intelligence, maintenance workflows, and enterprise fleet/business services.**

---

# 1. HOW TO THINK ABOUT EVTWIN
Before writing anything, internally evaluate EVTWIN simultaneously from the perspective of:
1. Principal Product Architect
2. Enterprise UX Architect
... (25 Expert Disciplines)
Each discipline must internally consider perspectives from a 20-person specialist pod.
Do not invent employee names. Do not claim these are actual employees.

---

# 2. WHAT EVTWIN ACTUALLY IS
EVTWIN is an intelligent connected-EV platform.
The platform connects:
```text
PHYSICAL EV → SENSORS / BMS / VEHICLE SIGNALS → EDGE DEVICE → MQTT → IOT COMMUNICATION LAYER → TELEMETRY INGESTION → VALIDATION + NORMALIZATION → DATA PLATFORM → DIGITAL TWIN → ANALYTICS + AI/ML → BACKEND SERVICES → REAL-TIME API / WEBSOCKET → EVTWIN WEB PLATFORM
```
It creates a **digital representation of the vehicle and its operational state**.

---

# 3. PRODUCT VISION
EVTWIN should evolve through these stages:
`EV IoT Monitoring → Connected Vehicle Platform → Vehicle Black Box → Digital Twin → AI Vehicle Diagnostics → Predictive Maintenance → Fleet Intelligence → Enterprise EV Intelligence Platform`

---

# 4. CURRENT PROJECT CONTEXT
The project has existing experience in: Arduino, IoT systems, MQTT, sensors (V, I, Temp), EV systems, Li-ion, BMS, GPS, MongoDB, Python, MATLAB/Simulink, Battery Builder.
The documentation must distinguish actual experience from future production architecture.

---

# 5. STATUS CLASSIFICATION
Every feature and architecture component must be classified as one of:
`IMPLEMENTED`, `PROTOTYPE`, `TESTED`, `PARTIALLY IMPLEMENTED`, `UNDER DEVELOPMENT`, `PLANNED`, `PROPOSED`, `SIMULATION`, `FUTURE`, `TBD`.

---

# 15. DATA SOURCE MODEL
Every important data point should be traceable to its origin:
`DEVICE`, `SIMULATION`, `MOCK`, `ESTIMATED`, `PREDICTED`, `IMPORTED`.

---

# 67. CRITICAL IMPLEMENTATION PRINCIPLE
Do not start by building dozens of UI pages with dummy telemetry.
First prove:
```text
ONE REAL SENSOR → ONE DEVICE → ONE MQTT MESSAGE → ONE DATABASE RECORD → ONE API RESPONSE → ONE WEBSITE COMPONENT
```
This is the first **vertical slice** of EVTWIN.

---

# 71. MASTER RULE
Whenever there is uncertainty, do not invent. Use `TBD` or `PROPOSED` or `PLANNED`. The objective is to create a technically credible architecture that clearly shows what we have, what we are building, how it works, how it will scale, and what it can become.
