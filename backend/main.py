# backend/main.py
import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from core.router import include_routers
from core.exceptions import (
    validation_exception_handler,
    http_exception_handler,
)

# --------------------------------------------------
# CARGAR VARIABLES DE ENTORNO
# --------------------------------------------------
load_dotenv()

# --------------------------------------------------
# LOGGING
# --------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# --------------------------------------------------
# APP
# --------------------------------------------------
app = FastAPI(
    title="Sistema de Pedidos y Entregas",
    version="1.0",
)

# --------------------------------------------------
# EXCEPTIONS
# --------------------------------------------------
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)

# --------------------------------------------------
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://192.168.0.11:3000",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# STATIC
# --------------------------------------------------
# app.mount("/public", StaticFiles(directory="public"), name="public")

# --------------------------------------------------
# ROUTERS
# --------------------------------------------------
include_routers(app)

# --------------------------------------------------
# STARTUP (SOLO INFRAESTRUCTURA)
# --------------------------------------------------
@app.on_event("startup")
def on_startup():
    logger.info("📦 Verificando / creando tablas")
    Base.metadata.create_all(bind=engine)

# --------------------------------------------------
# HEALTH
# --------------------------------------------------
@app.get("/", tags=["Estado del Servidor"])
def root():
    return {
        "status": "ok",
        "mensaje": "Backend funcionando correctamente"
    }
