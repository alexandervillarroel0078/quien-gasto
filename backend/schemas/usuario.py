from pydantic import BaseModel
from typing import Optional

class UsuarioLoginResponse(BaseModel):
    id: int
    correo: str
    persona_id: Optional[int]

    class Config:
        from_attributes = True
