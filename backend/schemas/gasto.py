from pydantic import BaseModel
from datetime import date
from decimal import Decimal
from typing import Optional


class PersonaMini(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

# =========================
# CREATE
# =========================
class GastoCreate(BaseModel):
    concepto: str
    monto: Decimal
    fecha: date
    periodo_id: Optional[int] = None
    categoria_id: Optional[int] = None


# =========================
# UPDATE (opcional)
# =========================
class GastoUpdate(BaseModel):
    concepto: Optional[str] = None
    monto: Optional[Decimal] = None
    fecha: Optional[date] = None
    periodo_id: Optional[int] = None
    categoria_id: Optional[int] = None


class CategoriaGastoMini(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True


# =========================
# RESPONSE (completo)
# =========================
class GastoResponse(BaseModel):
    id: int
    persona: PersonaMini
    usuario_login_id: int
    concepto: str
    monto: Decimal
    fecha: date
    periodo_id: Optional[int]
    categoria_id: Optional[int] = None
    categoria: Optional[CategoriaGastoMini] = None
    estado: Optional[str] = None

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
    persona: PersonaMini
    total: Decimal
