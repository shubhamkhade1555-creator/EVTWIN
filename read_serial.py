import serial
import time
import sys

port = 'COM3'
baudrate = 115200

try:
    ser = serial.Serial(port, baudrate, timeout=1)
    print(f"Connected to {port} at {baudrate} baud.")
except Exception as e:
    print(f"Failed to connect to {port}: {e}")
    sys.exit(1)

start_time = time.time()
while time.time() - start_time < 120:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8', errors='replace').strip()
        if line:
            print(line)
            sys.stdout.flush()
    else:
        time.sleep(0.1)

ser.close()
print("Finished reading serial output.")
