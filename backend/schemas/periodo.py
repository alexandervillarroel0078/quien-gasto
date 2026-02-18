from pydantic import BaseModel
from datetime import date

class PeriodoCreate(BaseModel):
    nombre: str
    fecha_inicio: date
    fecha_fin: date

class PeriodoUpdate(BaseModel):
    cerrado: bool

class PeriodoResponse(BaseModel):
    id: int
    nombre: str
    fecha_inicio: date
    fecha_fin: date
    cerrado: bool

    class Config:
        from_attributes = True
