# backend/schemas/finanzas/cuenta.py

from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime
from enum import Enum

class TipoCuentaEnum(str, Enum):
    BANCO = "BANCO"
    CAJA = "CAJA"
    AHORRO = "AHORRO"
    INVERSION = "INVERSION"
    

# =========================
# BASE
# =========================

class CuentaBase(BaseModel):
    nombre: str
    numero_cuenta: Optional[str] = None
    banco: Optional[str] = None
    tipo: TipoCuentaEnum
    moneda: Optional[str] = "BOB"
    saldo_inicial: Optional[Decimal] = Decimal("0.00")
    activo: Optional[bool] = True


# =========================
# CREATE
# =========================

class CuentaCreate(CuentaBase):
    pass


# =========================
# UPDATE
# =========================

class CuentaUpdate(BaseModel):
    nombre: Optional[str] = None
    numero_cuenta: Optional[str] = None
    banco: Optional[str] = None
    tipo: Optional[TipoCuentaEnum] = None
    moneda: Optional[str] = None
    saldo_inicial: Optional[Decimal] = None
    activo: Optional[bool] = None


# =========================
# RESPONSE
# =========================

class CuentaResponse(CuentaBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True
