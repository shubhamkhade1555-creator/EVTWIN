# Hardware Vertical Slice Test

**Status:** [IMPLEMENTED]

## 1. Purpose
To formally prove the real physical EVTWIN telemetry pipeline.

## 2. Acceptance Criteria
- [ ] Actual physical sensor connected
- [ ] Actual controller reads sensor
- [ ] Firmware publishes actual reading
- [ ] MQTT receives actual reading
- [ ] Backend receives actual reading
- [ ] Validation succeeds
- [ ] Real MongoDB stores actual reading
- [ ] API returns actual reading
- [ ] Website displays actual reading
- [ ] Source = DEVICE
- [ ] Timestamp is correct
- [ ] Quality is correct

## 3. Data Traceability Test
For a single physical temperature event (e.g., holding the sensor to warm it up), the recorded temperature value must be exactly identical across:
1. ESP32 Serial Monitor
2. MQTT Broker payload
3. MongoDB Document
4. EVTWIN UI
