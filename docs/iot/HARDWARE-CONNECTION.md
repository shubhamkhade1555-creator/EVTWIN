# Hardware Connection Specification

**Status:** [PROTOTYPE]

## 1. Current Sensor Connections
The following details the *actual* hardware connections validated in the prototype.

| Component | Pin | Signal Type | Voltage | Interface | Sampling | Purpose | Prototype Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Voltage Divider | A0 | Analog | 0-5V | ADC | 10Hz | Battery Pack Voltage | [TESTED] |
| Current Sensor (e.g. ACS712) | A1 | Analog | 0-5V | ADC | 10Hz | Battery Current | [TESTED] |
| Thermistor | A2 | Analog | 0-5V | ADC | 1Hz | Battery Temperature | [TESTED] |
| GPS Module | RX/TX | Digital | 3.3V | UART | 1Hz | Location | [PLANNED / NOT YET VALIDATED] |

## 2. Fallback Behavior
- **Sensor Failure:** If a pin reads out of the operational bounds (e.g., 0V or 5V continuously on a biased sensor), the edge device tags the telemetry `quality = INVALID`.
- **Power Loss:** The device relies on local buffering. Future revisions require a robust watchdog and brownout detection.
