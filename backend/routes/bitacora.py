from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from models.models import Bitacora
from schemas.bitacora import BitacoraResponse
from schemas.common import Page

router = APIRouter(prefix="/bitacora", tags=["Bitacora"])


@router.get("/", response_model=Page[BitacoraResponse])
def listar(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    entidad: str | None = Query(None),
    usuario_id: int | None = Query(None),
    accion: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Bitacora)

    if entidad:
        query = query.filter(Bitacora.entidad == entidad)

    if usuario_id:
        query = query.filter(Bitacora.usuario_id == usuario_id)

    if accion:
        query = query.filter(Bitacora.accion == accion)

    total = query.count()

    items = (
        query
        .order_by(Bitacora.fecha.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    return {
        "items": items,
        "page": page,
        "size": size,
        "total": total,
        "pages": (total + size - 1) // size,
    }
