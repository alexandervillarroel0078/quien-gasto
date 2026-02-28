# backend/schemas/finanzas/categoria_movimiento.py

from pydantic import BaseModel
from typing import Optional


# =========================
# BASE
# =========================

class CategoriaMovimientoBase(BaseModel):
    nombre: str
    tipo: str  # INGRESO o EGRESO
    activo: Optional[bool] = True


# =========================
# CREATE
# =========================

class CategoriaMovimientoCreate(CategoriaMovimientoBase):
    pass


# =========================
# UPDATE
# =========================

class CategoriaMovimientoUpdate(BaseModel):
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    activo: Optional[bool] = None


# =========================
# RESPONSE
# =========================

class CategoriaMovimientoResponse(CategoriaMovimientoBase):
    id: int

    class Config:
        from_attributes = True
