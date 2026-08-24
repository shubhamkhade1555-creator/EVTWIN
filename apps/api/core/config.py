import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "EVTWIN Enterprise API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    MONGODB_DATABASE: str = os.getenv("MONGODB_DATABASE", "evtwin")
    
    # JWT Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "evtwin_super_secret_jwt_key_2026_automobile_intelligence")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # MQTT
    MQTT_BROKER: str = os.getenv("MQTT_BROKER", "test.mosquitto.org")
    MQTT_PORT: int = int(os.getenv("MQTT_PORT", "1883"))
    MQTT_TOPIC_SUBSCRIPTION: str = "evtwin/+/+/telemetry"
    
    # Environment
    IS_TESTING: bool = os.getenv("IS_TESTING", "false").lower() == "true"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
