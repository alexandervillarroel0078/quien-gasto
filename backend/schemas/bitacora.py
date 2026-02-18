from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BitacoraResponse(BaseModel):
    id: int
    entidad: str
    entidad_id: int
    accion: str
    descripcion: Optional[str]
    usuario_id: Optional[int]
    fecha: datetime

    class Config:
        from_attributes = True


class BitacoraCreate(BaseModel):
    entidad: str
    entidad_id: int
    accion: str
    descripcion: Optional[str] = None
    usuario_id: Optional[int] = None


class BitacoraFilter(BaseModel):
    entidad: Optional[str] = None
    usuario_id: Optional[int] = None
    accion: Optional[str] = None
