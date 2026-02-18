# core/dependencies.py

from fastapi import Depends, HTTPException, status
from core.auth import get_current_user
from core.permissions import PERMISOS


def require_permission(permiso: str):
    def checker(usuario = Depends(get_current_user)):
        rol = usuario.get("rol")

        if not rol:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario sin rol"
            )

        roles_permitidos = PERMISOS.get(permiso, set())

        if rol not in roles_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"No tienes permiso para: {permiso}"
            )

        return usuario

    return checker



def get_usuario(permiso: str | None = None):
    def dependency(usuario = Depends(get_current_user)):
        if permiso is not None:
            rol = usuario.get("rol")

            roles_permitidos = PERMISOS.get(permiso, set())
            if rol not in roles_permitidos:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"No tienes permiso para: {permiso}"
                )

        return usuario

    return dependency