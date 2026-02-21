# schemas/categoria_gasto.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CategoriaGastoCreate(BaseModel):
    nombre: str


class CategoriaGastoUpdate(BaseModel):
    nombre: Optional[str] = None


class CategoriaGastoResponse(BaseModel):
    id: int
    nombre: str
    activo: bool

    class Config:
        from_attributes = True
