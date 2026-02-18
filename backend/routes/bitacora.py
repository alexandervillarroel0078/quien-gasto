from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models.models import Bitacora, UsuarioLogin
from schemas.common import Page
from schemas.bitacora import BitacoraResponse

router = APIRouter(prefix="/bitacora", tags=["Bitacora"])


@router.get("/", response_model=Page[BitacoraResponse])
def listar_bitacora(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    entidad: str | None = Query(None),
    accion: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Bitacora).options(
        joinedload(Bitacora.usuario).joinedload(UsuarioLogin.persona)
    )

    if entidad:
        query = query.filter(Bitacora.entidad == entidad)

    if accion:
        query = query.filter(Bitacora.accion == accion)

    total = query.count()

    items = (
        query.order_by(Bitacora.fecha.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    # 🔥 MAPEADO LIMPIO (NO expone login)
    def map_item(b: Bitacora):
        return {
            "id": b.id,
            "entidad": b.entidad,
            "entidad_id": b.entidad_id,
            "accion": b.accion,
            "descripcion": b.descripcion,
            "fecha": b.fecha,
            "usuario": (
                {
                    "id": b.usuario.persona.id,
                    "nombre": b.usuario.persona.nombre,
                }
                if b.usuario and b.usuario.persona
                else None
            ),
        }

    return {
        "items": [map_item(b) for b in items],
        "page": page,
        "size": size,
        "total": total,
        "pages": (total + size - 1) // size,
    }
