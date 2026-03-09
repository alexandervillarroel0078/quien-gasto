from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from decimal import Decimal
from models.models import EstadoPrestamoEnum


# =========================
# MINI PERSONA
# =========================
class PersonaMiniResponse(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True


# =========================
# PAGO PRESTAMO
# =========================

class PagoPrestamoBase(BaseModel):
    monto: Decimal
    fecha: date


class PagoPrestamoCreate(PagoPrestamoBase):
    pass


class PagoPrestamoUpdate(BaseModel):
    monto: Optional[Decimal] = None
    fecha: Optional[date] = None


class PagoPrestamoResponse(PagoPrestamoBase):
    id: int
    usuario_login_id: int

    class Config:
        from_attributes = True


# =========================
# PRESTAMO
# =========================

class PrestamoBase(BaseModel):
    prestamista_id: int
    deudor_id: int
    monto: Decimal
    fecha: date
    concepto: Optional[str] = None


class PrestamoCreate(PrestamoBase):
    pass


class PrestamoUpdate(BaseModel):
    concepto: Optional[str] = None
    estado: Optional[EstadoPrestamoEnum] = None


class PrestamoResponse(BaseModel):
    id: int

    prestamista: PersonaMiniResponse
    deudor: PersonaMiniResponse

    monto: Decimal
    saldo_pendiente: Decimal

    fecha: date
    concepto: Optional[str]

    estado: EstadoPrestamoEnum

    pagos: List[PagoPrestamoResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True