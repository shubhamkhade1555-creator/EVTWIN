# Local IoT Setup

**Status:** [IMPLEMENTED]

## 1. Prerequisites
- Docker & Docker Compose (For MongoDB)
- Python 3.10+
- Arduino IDE (For ESP32 firmware)

## 2. Running MongoDB Locally
A `docker-compose.yml` is provided in the project root.
```bash
docker-compose up -d
```
This spins up a real MongoDB instance on port 27017.

## 3. Running the Backend
Create a `.env` file containing:
```text
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DATABASE=evtwin
```
Run the ingestion and API server:
```bash
python real_vertical_slice.py
```

## 4. Flashing the ESP32
Open `EVTWIN/edge/firmware.ino` in Arduino IDE. Set your WiFi credentials and flash the board. Ensure the physical sensor is wired correctly.
