# IoT Failure Tests

**Status:** [IMPLEMENTED]

## TEST-HW-001: Hardware Disconnect
1. Start sensor and verify telemetry.
2. Disconnect sensor signal wire.
3. **Verify:** Device assigns `quality: INVALID`. Backend logs it. UI shows degraded/stale state.

## TEST-HW-002: Network Failure
1. Start device and verify MQTT.
2. Disconnect WiFi.
3. **Verify:** Device buffers locally (if implemented) or logs failure.
4. Restore WiFi. Verify automatic reconnection and telemetry resumption.

## TEST-HW-003: MQTT Broker Failure
1. Stop the MQTT broker service.
2. **Verify:** Device detects disconnect and attempts reconnect.
3. Restart broker. Verify telemetry resumes.

## TEST-HW-004: Database Failure
1. Stop the MongoDB container.
2. **Verify:** Ingestion service catches `PyMongoError`, logs failure. System does NOT report false success to any API.
