#ifndef CONFIGURATION_H
#define CONFIGURATION_H

// ==============================================================================
// EVTWIN FIRMWARE CONFIGURATION (EXAMPLE)
// Instructions:
// 1. Rename this file to `configuration.h` (DO NOT commit `configuration.h` to Git).
// 2. Replace the placeholder values with your actual network and MQTT credentials.
// ==============================================================================

// 1. Wi-Fi Configuration
#define WIFI_SSID "YOUR_WIFI_NAME"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// 2. MQTT Broker Configuration
#define MQTT_BROKER "broker.hivemq.com"
#define MQTT_PORT 1883
#define MQTT_USERNAME "" // Leave empty if not using authentication
#define MQTT_PASSWORD "" // Leave empty if not using authentication
#define MQTT_CLIENT_ID "EVTWIN_Edge_DEV001"

// 3. EVTWIN Contract Configuration
#define MQTT_TOPIC "evtwin/ORG001/EV001/telemetry"
#define TENANT_ID "ORG001"
#define VEHICLE_ID "EV001"
#define DEVICE_ID "DEV001"
#define SCHEMA_VERSION "1.0"
#define SOURCE_ID "DEVICE"

// 4. Hardware Configuration
// DS18B20 Data Pin (Requires 4.7k pull-up resistor to 3.3V)
#define ONE_WIRE_BUS 4 
#define TELEMETRY_INTERVAL_MS 5000 // Send data every 5 seconds

#endif // CONFIGURATION_H
