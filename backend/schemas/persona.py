from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PersonaLookup(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True
        
# =========================
# CREATE
# =========================
class PersonaCreate(BaseModel):
    nombre: str


# =========================
# UPDATE
# =========================
class PersonaUpdate(BaseModel):
    nombre: Optional[str] = None
    activo: Optional[bool] = None


# =========================
# RESPONSE
# =========================
class PersonaResponse(BaseModel):
    id: int
    nombre: str
    activo: bool
    fecha_creacion: datetime

    class Config:
        from_attributes = True
