# backend/schemas/finanzas/movimiento_schema.py

from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import date
from enum import Enum

class EstadoMovimientoEnum(str, Enum):
    ACTIVO = "ACTIVO"
    ANULADO = "ANULADO"

from schemas.banco.cuenta import CuentaResponse
from schemas.banco.categoria_movimiento import (
    CategoriaMovimientoResponse,
)


# =========================
# BASE
# =========================

class MovimientoBase(BaseModel):
    cuenta_id: int
    tipo: str  # INGRESO / EGRESO
    monto: Decimal
    concepto: Optional[str] = None
    fecha: date
    categoria_id: Optional[int] = None


# =========================
# CREATE
# =========================

class MovimientoCreate(MovimientoBase):
    pass


# =========================
# UPDATE
# =========================

class MovimientoUpdate(BaseModel):
    cuenta_id: Optional[int] = None
    tipo: Optional[str] = None
    monto: Optional[Decimal] = None
    concepto: Optional[str] = None
    fecha: Optional[date] = None
    categoria_id: Optional[int] = None
    estado: Optional[EstadoMovimientoEnum] = None


# =========================
# RESPONSE
# =========================

class MovimientoResponse(MovimientoBase):
    id: int
    estado: EstadoMovimientoEnum

    cuenta: CuentaResponse
    categoria: Optional[CategoriaMovimientoResponse] = None

    class Config:
        from_attributes = True
