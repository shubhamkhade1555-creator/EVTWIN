# EVTWIN Hardware Integration & Firmware Engineering Handoff

**Document Version:** 1.0.0 (FROZEN)  
**Governance Authority:** `EVTWIN/docs/MASTER-PRODUCT-SYSTEM-TRUTH.md` (Rules 15, 21, 55, 67, 71)  
**Target Audience:** IoT Edge Firmware Engineers, Embedded Systems Team, Vehicle Integration Engineers

---

## 1. Executive Summary & Scope Separation

The **EVTWIN Connected Electric Vehicle & Digital Twin Platform** software layer is fully implemented, verified, and operational.

Physical microcontrollers (ESP32 / Automotive ECUs) interface with this platform **strictly over standardized MQTT JSON telemetry contracts**. No custom backend modifications are required when attaching physical sensor hardware.

```
+-------------------------------------------------------------+
|                     PHYSICAL HARDWARE                       |
|   48V Battery Pack -> Shunt / Thermistors -> ESP32 Edge     |
+------------------------------+------------------------------+
                               | MQTTS (QoS 1)
                               v
+-------------------------------------------------------------+
|                     EVTWIN CLOUD PLATFORM                   |
|   MQTT Ingestion -> FastAPI -> MongoDB -> Role Dashboards   |
+-------------------------------------------------------------+
```

---

## 2. Ingestion Contracts & Protocol Specifications

### 2.1 MQTT Ingestion Specification
- **Broker Host:** Configured in `settings.MQTT_BROKER` (Default: `test.mosquitto.org:1883`)
- **Transport Security:** TLS / SSL (Port 8883 in production)
- **Topic Hierarchy:** `evtwin/{tenantId}/{vehicleId}/telemetry`
- **Quality of Service (QoS):** `1` (At least once delivery)
- **Publish Rate:** 1.0 Hz (1 transmission per second) during active drive cycles; 0.1 Hz (every 10s) when idle.

### 2.2 Telemetry JSON Payload Schema (Contract v1.0)
All edge firmware must transmit UTF-8 JSON payloads formatted strictly as follows:

```json
{
  "schemaVersion": "1.0",
  "tenantId": "ORG001",
  "vehicleId": "EV001",
  "deviceId": "DEV001",
  "timestamp": "2026-08-23T16:30:00.000Z",
  "sequenceNumber": 1042,
  "source": "DEVICE",
  "quality": "VALID",
  "battery": {
    "voltage": 48.25,
    "current": 12.40,
    "temperature": 34.8,
    "soc": 78.5
  },
  "motor": {
    "rpm": 1850,
    "temperature": 42.3,
    "current": 11.20
  },
  "vehicle": {
    "speed": 31.4,
    "latitude": 16.8523,
    "longitude": 74.5815
  }
}
```

---

## 3. Physical Hardware Range & Calibration Constraints

Every physical sensor reading must adhere to the validated automotive boundaries:

| Signal Parameter | Target Units | Hardware Valid Range | Critical Alarm Threshold | Normal Nominal Value |
|---|---|---|---|---|
| **Battery Voltage** | Volts (V) | `40.0 V` – `58.4 V` | `< 41.0 V` or `> 57.8 V` | `48.0 V` – `54.6 V` |
| **Discharge Current** | Amperes (A) | `-50.0 A` – `150.0 A` | `> 45.0 A continuous` | `5.0 A` – `25.0 A` |
| **Pack Temperature** | Celsius (°C) | `-20.0 °C` – `80.0 °C` | `> 50.0 °C` | `25.0 °C` – `38.0 °C` |
| **State of Charge** | Percent (%) | `0.0 %` – `100.0 %` | `< 15.0 %` | `20.0 %` – `95.0 %` |
| **Motor RPM** | RPM | `0` – `6000 RPM` | `> 5500 RPM` | `1000` – `3500 RPM` |
| **Motor Core Temp** | Celsius (°C) | `-20.0 °C` – `120.0 °C` | `> 75.0 °C` | `35.0 °C` – `55.0 °C` |
| **Vehicle Speed** | km/h | `0.0` – `140.0 km/h` | `> 80.0 km/h` (fleet cap)| `20.0` – `55.0 km/h` |

> [!IMPORTANT]
> **Data Provenance Rule (Rule 15):**  
> Edge firmware flashing code MUST set `"source": "DEVICE"`.  
> Software test simulators MUST set `"source": "SIMULATION"`.  
> The backend automatically validates provenance headers and rejects mislabeled sources.

---

## 4. Hardware Bench Checklist Before Vehicle Attachment

1. **Power Supply & Voltage Divider Calibration:**
   - Verify 48V battery divider ratio on ADC channel 34 (`GPIO34`).
   - Calibrate voltage reading with digital multimeter reference (Target: `±0.05 V` precision).
2. **Current Shunt & Op-Amp Offset:**
   - Zero-point calibrate the current amplifier at 0 A quiescent load.
   - Verify negative current polarity during regenerative braking charge cycles.
3. **NTC Thermistor Curve (Steinhart-Hart):**
   - Calibrate 10k NTC thermistors across Module 1 and Module 2.
   - Validate thermal cut-off test at 50.0 °C bench simulation.
4. **Sequence Number Persistence:**
   - Sequence number must increment monotonically across device restarts using non-volatile storage (NVS / EEPROM).
5. **MQTT Offline Ring Buffer:**
   - In the event of cellular or Wi-Fi disconnection, buffer at least 300 telemetry packets in edge RAM.
   - Flush buffered packets upon reconnection with original sensor UTC timestamps.

---

## 5. Device Provisioning Workflow

To provision a physical hardware edge unit:
1. Login to EVTWIN as `SUPER_ADMIN` or `COMPANY_ADMIN`.
2. Issue a `POST /api/v1/devices` with:
   ```json
   {
     "deviceId": "DEV005",
     "vehicleId": "EV001",
     "hardwareVersion": "ESP32-WROOM-32D",
     "firmwareVersion": "v1.2.0"
   }
   ```
3. Flash the generated `deviceId` and `tenantId` credentials into the ESP32 firmware configuration header (`config.h`).
4. Power cycle the hardware and verify live telemetry appearing in `/vehicles/{vehicleId}` dashboard with `"source": "DEVICE"`.
