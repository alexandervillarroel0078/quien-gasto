from pydantic import BaseModel
from decimal import Decimal

class ResumenPersonaResponse(BaseModel):
    persona_id: int
    nombre: str
    total_aportes: Decimal
    total_gastos: Decimal
    balance: Decimal
