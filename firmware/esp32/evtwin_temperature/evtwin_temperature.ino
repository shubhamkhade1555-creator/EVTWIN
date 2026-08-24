#include <WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <time.h>

// If you have configured configuration.h, include it. Otherwise, use these defaults.
#if __has_include("configuration.h")
#include "configuration.h"
#else
// --- DEFAULT CONFIGURATION FOR COMPILATION ---
#include "secrets.local.h"
#define MQTT_BROKER "broker.hivemq.com"
#define MQTT_PORT 1883
#define MQTT_USERNAME ""
#define MQTT_PASSWORD ""
#define MQTT_CLIENT_ID "EVTWIN_Edge_DEV001"
#define MQTT_TOPIC "evtwin/ORG001/EV001/telemetry"
#define TENANT_ID "ORG001"
#define VEHICLE_ID "EV001"
#define DEVICE_ID "DEV001"
#define SCHEMA_VERSION "1.0"
#define SOURCE_ID "DEVICE"
#define ONE_WIRE_BUS 4
#define TELEMETRY_INTERVAL_MS 5000
#endif

// --- NTP TIME CONFIGURATION ---
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;
const int   daylightOffset_sec = 0;

// --- HARDWARE CONFIGURATION ---
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);
bool sensorDetected = false;

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
long sequenceNumber = 0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWi-Fi: CONNECTED");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWi-Fi: DISCONNECTED (Failed to connect)");
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Attempt to connect
    if (client.connect(MQTT_CLIENT_ID, MQTT_USERNAME, MQTT_PASSWORD)) {
      Serial.println("CONNECTED");
      Serial.print("Topic: ");
      Serial.println(MQTT_TOPIC);
    } else {
      Serial.print("DISCONNECTED, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("\nEVTWIN firmware starting...");
  Serial.println("Board: ESP32");
  Serial.print("Device ID: ");
  Serial.println(DEVICE_ID);
  
  // Start the DS18B20 sensor
  sensors.begin();
  int deviceCount = sensors.getDeviceCount();
  if (deviceCount > 0) {
    Serial.println("Sensor: DS18B20");
    sensorDetected = true;
  } else {
    Serial.println("Sensor: ERROR (No DS18B20 detected on GPIO4)");
    sensorDetected = false;
  }
  
  setup_wifi();
  
  // Init and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  
  client.setServer(MQTT_BROKER, MQTT_PORT);
}

// Function to get current UTC time as ISO8601 string
String getISO8601Time() {
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    return ""; // Failed to obtain time
  }
  char timeStringBuff[30]; // 2026-08-24T00:00:00Z
  strftime(timeStringBuff, sizeof(timeStringBuff), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(timeStringBuff);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    setup_wifi();
  }
  
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > TELEMETRY_INTERVAL_MS) {
    lastMsg = now;
    
    if (sensorDetected) {
      sensors.requestTemperatures();
      float tempC = sensors.getTempCByIndex(0);
      
      if (tempC == DEVICE_DISCONNECTED_C) {
        Serial.println("Error: Could not read temperature data");
      } else {
        sequenceNumber++;
        String quality = "VALID";
        
        // Basic sanity check for automotive environment validation
        if (tempC < -40 || tempC > 125) {
          quality = "INVALID";
        }
        
        String timestamp = getISO8601Time();
        
        // Build JSON string payload
        String payload = "{";
        payload += "\"schemaVersion\":\"" + String(SCHEMA_VERSION) + "\",";
        payload += "\"tenantId\":\"" + String(TENANT_ID) + "\",";
        payload += "\"vehicleId\":\"" + String(VEHICLE_ID) + "\",";
        payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
        if (timestamp.length() > 0) {
           payload += "\"timestamp\":\"" + timestamp + "\",";
        }
        payload += "\"sequenceNumber\":" + String(sequenceNumber) + ",";
        payload += "\"source\":\"" + String(SOURCE_ID) + "\",";
        payload += "\"quality\":\"" + quality + "\",";
        payload += "\"battery\":{";
        payload += "\"temperature\":" + String(tempC, 2);
        payload += "}}";
        
        Serial.println("Temperature: " + String(tempC) + " °C");
        Serial.println("Publish: SUCCESS");
        
        client.publish(MQTT_TOPIC, payload.c_str());
      }
    }
  }
}
