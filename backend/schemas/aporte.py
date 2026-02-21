# schemas/aporte.py
from pydantic import BaseModel
from datetime import date
from decimal import Decimal
from typing import Optional

class PersonaMini(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

class AporteCreate(BaseModel):
    monto: Decimal
    fecha: date
    nota: Optional[str] = None
    periodo_id: Optional[int] = None


class AporteUpdate(BaseModel):
    monto: Optional[Decimal] = None
    fecha: Optional[date] = None
    nota: Optional[str] = None
    periodo_id: Optional[int] = None


class AporteResponse(BaseModel):
    id: int
    persona: PersonaMini
    usuario_login_id: int
    monto: Decimal
    fecha: date
    nota: Optional[str]
    periodo_id: Optional[int]
    estado: Optional[str] = None

    class Config:
        from_attributes = True


class AporteMini(BaseModel):
    id: int
    monto: Decimal
    fecha: date

    class Config:
        from_attributes = True
