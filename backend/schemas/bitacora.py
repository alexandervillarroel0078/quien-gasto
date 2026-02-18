from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PersonaMini(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True


class BitacoraResponse(BaseModel):
    id: int
    entidad: str
    entidad_id: int
    accion: str
    descripcion: Optional[str]
    fecha: datetime
    usuario: Optional[PersonaMini]

    class Config:
        from_attributes = True


class BitacoraCreate(BaseModel):
    entidad: str
    entidad_id: int
    accion: str
    descripcion: Optional[str] = None
    usuario_id: Optional[int] = None
