from pydantic import BaseModel
from datetime import datetime

class PersonaResponse(BaseModel):
    id: int
    nombre: str
    activo: bool
    fecha_creacion: datetime

    class Config:
        from_attributes = True
