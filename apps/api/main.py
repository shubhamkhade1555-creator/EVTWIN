import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.database import init_db
from services.mqtt_service import start_mqtt_client, stop_mqtt_client

# Routers
from routers import auth, organizations, users, vehicles, devices, telemetry, trips, alerts, diagnostics, maintenance, analytics, admin

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("EVTWIN-APP")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing EVTWIN Enterprise API and Database...")
    init_db()
    
    if not settings.IS_TESTING:
        logger.info("Starting MQTT Ingestion Listener...")
        start_mqtt_client()
        
    yield
    
    # Shutdown
    logger.info("Shutting down EVTWIN services...")
    stop_mqtt_client()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Connected Electric Vehicle & Digital Twin Platform API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All API Routers under /api/v1
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(organizations.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(vehicles.router, prefix=settings.API_V1_STR)
app.include_router(devices.router, prefix=settings.API_V1_STR)
app.include_router(telemetry.router, prefix=settings.API_V1_STR)
app.include_router(trips.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(diagnostics.router, prefix=settings.API_V1_STR)
app.include_router(maintenance.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": "EVTWIN",
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "contract": "TELEMETRY_v1.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
