# backend/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models.models import UsuarioLogin
from core.auth import crear_token, verify_password

router = APIRouter(prefix="/auth", tags=["Autenticación"])


# ===============================
# 🟦 Esquema para login
# ===============================
class LoginRequest(BaseModel):
    correo: str
    password: str


# ====================================
# 🔵 LOGIN USUARIO → RETORNA TOKEN JWT
# ====================================
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    # 1️⃣ Buscar usuario
    usuario = (
        db.query(UsuarioLogin)
        .filter(UsuarioLogin.correo == data.correo)
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )

    # 2️⃣ Verificar contraseña
    if not verify_password(data.password, usuario.contrasena):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )

    # 3️⃣ Validar que tenga persona asociada
    if not usuario.persona_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario sin persona asignada"
        )

    # 4️⃣ Crear token JWT
    token = crear_token(data={
        "sub": str(usuario.id),
        "persona_id": usuario.persona_id
    })

    # 5️⃣ Respuesta
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario_id": usuario.id,
        "correo": usuario.correo,
        "persona_id": usuario.persona_id,
        "mensaje": "Inicio de sesión exitoso 👌"
    }
