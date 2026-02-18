# 3erproyecto/backend/routes/usuarios.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models.models as models
from core.auth import verificar_token

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/perfil")
def obtener_perfil(
    conductor_actual = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """Retorna solo el perfil del conductor logueado"""

    return {
        "id": conductor_actual.id,
        "nombre": conductor_actual.nombre,
        "apellido": conductor_actual.apellido if hasattr(conductor_actual, "apellido") else None,
        "correo": conductor_actual.correo,
        "telefono": conductor_actual.telefono,
        "licencia": conductor_actual.licencia if hasattr(conductor_actual, "licencia") else None,
        "estado": conductor_actual.estado,
        "mensaje": "Perfil cargado correctamente"
    }