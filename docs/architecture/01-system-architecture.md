# Complete System Architecture

**Status:** [PARTIALLY IMPLEMENTED]

## 1. Overview
EVTWIN is designed as an intelligent connected-EV platform. The system architecture defines the data flow from physical sensors through IoT ingestion into scalable cloud storage, enabling analytics and real-time visualization.

## 2. Architecture Diagram

```mermaid
graph TD
    subgraph EV[Physical EV]
        S1[Voltage/Current]
        S2[Temperature]
        S3[GPS/IMU]
    end
    
    subgraph Edge[Edge Device]
        MCU[Arduino / ESP32]
        Val[Device Validation]
    end
    
    subgraph Cloud[Cloud Architecture]
        MQTT[MQTT Broker over TLS]
        Ingest[IoT Ingestion Service]
        DB[(MongoDB)]
        API[Backend REST API]
        WS[WebSocket Service]
    end
    
    subgraph Analytics[Analytics]
        DT[Digital Twin / ML]
    end
    
    subgraph Client[EVTWIN Web Application]
        UI[Dashboards]
    end
    
    EV --> Edge
    S1 --> MCU
    S2 --> MCU
    S3 --> MCU
    MCU --> Val
    Val -->|MQTT| MQTT
    MQTT --> Ingest
    Ingest --> DB
    DB --> DT
    DT --> DB
    DB --> API
    Ingest --> WS
    API --> UI
    WS --> UI
```

## 3. Component Details
- **EV Sensors:** Real hardware currently collects battery voltage, current, and temperature.
- **Edge Device:** Currently prototyped using Arduino/ESP32. Production recommends automotive-grade MCU.
- **IoT Ingestion:** Validates, normalizes, and deduplicates telemetry before storage.
- **Database:** MongoDB serves as the primary data store (currently standard collections; time-series planned).
- **Client:** The website must *never* directly access MongoDB. Communication flows strictly through the API/WebSocket layer.
