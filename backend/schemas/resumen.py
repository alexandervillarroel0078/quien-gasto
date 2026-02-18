# schemas/resumen.py
from pydantic import BaseModel
from decimal import Decimal

class ResumenPersonaResponse(BaseModel):
    persona_id: int
    nombre: str
    total_aportes: float
    total_gastos: float
    balance: float

    class Config:
        from_attributes = True
