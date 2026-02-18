# backend/core/auth.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import get_db
from models import models

# ==============================
# 🔐 CONFIGURACIÓN JWT
# ==============================
SECRET_KEY = "super_secret_key_cambia_esto"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ==============================
# 🔑 FUNCIONES DE PASSWORD
# ==============================
def hash_password(password: str):
    """Cifra la contraseña en formato bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    """Verifica una contraseña con su hash."""
    return pwd_context.verify(plain_password, hashed_password)

# ==============================
# 📦 CREAR TOKEN
# ==============================
def crear_token(data: dict, expires_delta: timedelta | None = None):
    """Genera un token JWT con expiración."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
 
def verificar_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        usuario_id = payload.get("sub")
        rol = payload.get("rol")

        if not usuario_id or not rol:
            raise HTTPException(status_code=401, detail="Token inválido")

        return {
            "id": int(usuario_id),
            "rol": rol
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Token expirado o inválido")

def get_current_user(
    token_data: dict = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Retorna el usuario actual (UsuarioLogin + Persona).
    """

    usuario_login = (
        db.query(models.UsuarioLogin)
        .filter(models.UsuarioLogin.id == token_data["id"])
        .first()
    )

    if not usuario_login:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    return {
        "id": usuario_login.id,                 # id de login
        "correo": usuario_login.correo,
        "rol": token_data["rol"],               # si lo sigues usando
        "persona_id": usuario_login.persona_id  # 🔑 CLAVE PARA APORTES/GASTOS
    }
