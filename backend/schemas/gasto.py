from pydantic import BaseModel
from datetime import date
from decimal import Decimal
from typing import Optional


# =========================
# CREATE
# =========================
class GastoCreate(BaseModel):
    concepto: str
    monto: Decimal
    fecha: date
    periodo_id: Optional[int] = None


# =========================
# UPDATE (opcional)
# =========================
class GastoUpdate(BaseModel):
    concepto: Optional[str] = None
    monto: Optional[Decimal] = None
    fecha: Optional[date] = None
    periodo_id: Optional[int] = None


# =========================
# RESPONSE (completo)
# =========================
class GastoResponse(BaseModel):
    id: int
    persona_id: int
    usuario_login_id: int
    concepto: str
    monto: Decimal
    fecha: date
    periodo_id: Optional[int]

    class Config:
        from_attributes = True


# =========================
# MINI (listas simples / resumen)
# =========================
class GastoMini(BaseModel):
    id: int
    concepto: str
    monto: Decimal
    fecha: date

    class Config:
        from_attributes = True


# =========================
# RESUMEN (para balances)
# =========================
class GastoResumen(BaseModel):
    persona_id: int
    total: Decimal
