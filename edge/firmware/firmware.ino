#include <WiFi.h>
#include <PubSubClient.h>

// --- CONFIGURATION ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "test.mosquitto.org";

// --- CONTRACT CONSTANTS ---
const char* mqtt_topic = "evtwin/ORG001/EV001/telemetry";
const char* device_id = "DEV001";
const char* vehicle_id = "EV001";
const char* tenant_id = "ORG001";
const char* schema_version = "1.0";
const char* source_id = "DEVICE";

// --- HARDWARE CONFIG ---
// TBD: Change this pin based on the actual sensor (e.g., analog pin for thermistor or digital for DS18B20)
const int SENSOR_PIN = 34; 

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
long sequenceNumber = 0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("EVTWIN_Edge_DEV001")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

float readTemperature() {
  // --- TBD: HARDWARE IDENTIFICATION REQUIRED ---
  // Replace this logic with the actual formula for your specific sensor (e.g. DS18B20 or thermistor).
  // This is a placeholder for a generic analog read mapped to 20-40 degrees for testing.
  int rawValue = analogRead(SENSOR_PIN);
  float temp = 20.0 + (rawValue / 4095.0) * 20.0; 
  return temp;
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;
    sequenceNumber++;

    float temp = readTemperature();
    String quality = "VALID";
    
    // Test HW-001: Sensor Failure Detection
    if (temp < -10 || temp > 100) {
      quality = "INVALID";
    }

    // Build JSON string fulfilling the TELEMETRY-CONTRACT.md
    String payload = "{";
    payload += "\"schemaVersion\":\"" + String(schema_version) + "\",";
    payload += "\"tenantId\":\"" + String(tenant_id) + "\",";
    payload += "\"vehicleId\":\"" + String(vehicle_id) + "\",";
    payload += "\"deviceId\":\"" + String(device_id) + "\",";
    payload += "\"sequenceNumber\":" + String(sequenceNumber) + ",";
    payload += "\"source\":\"" + String(source_id) + "\",";
    payload += "\"quality\":\"" + quality + "\",";
    // TBD: An ESP32 needs NTP to generate proper ISO-8601 UTC timestamps. 
    // Backend will assign 'receivedAt' if device timestamp is omitted/invalid in this MVP.
    payload += "\"battery\":{";
    payload += "\"temperature\":" + String(temp, 2);
    payload += "}}";

    Serial.print("Publishing message: ");
    Serial.println(payload);
    
    client.publish(mqtt_topic, payload.c_str());
  }
}
