# Real Temperature Sensor Specification

**Status:** HARDWARE IDENTIFICATION REQUIRED

## 1. Sensor Details
- **Sensor:** TBD (e.g., DS18B20, LM35)
- **Controller:** ESP32 (Proposed)
- **Interface:** TBD (Analog / 1-Wire)
- **Voltage:** 3.3V / 5V
- **Measurement Range:** TBD
- **Sampling Frequency:** 5 Hz

## 2. Wiring Diagram
*(Wiring diagram pending hardware identification)*
- Power: VCC
- Ground: GND
- Signal: GPIO Pin TBD

## 3. Calibration & Conversion
- Formula: TBD based on exact sensor datasheet.
- Expected Range: 0°C to 80°C.
- Failure Detection: Readings of exactly 0V or VCC indicate sensor disconnect.
