from pydantic import BaseModel
from datetime import date

class PeriodoLookup(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

class PeriodoCreate(BaseModel):
    nombre: str
    fecha_inicio: date
    fecha_fin: date

class PeriodoUpdate(BaseModel):
    nombre: str | None = None
    fecha_inicio: date | None = None
    fecha_fin: date | None = None
    cerrado: bool | None = None

class PeriodoResponse(BaseModel):
    id: int
    nombre: str
    fecha_inicio: date
    fecha_fin: date
    cerrado: bool

    class Config:
        from_attributes = True
