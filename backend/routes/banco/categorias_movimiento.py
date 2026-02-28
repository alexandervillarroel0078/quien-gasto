from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models.models import CategoriaMovimiento, Bitacora
from schemas.banco.categoria_movimiento import (
    CategoriaMovimientoCreate,
    CategoriaMovimientoUpdate,
    CategoriaMovimientoResponse,
)
from schemas.common import Page
from core.auth import get_current_user

router = APIRouter(prefix="/categorias-movimiento", tags=["Categorias Movimiento"])


@router.get("/", response_model=Page[CategoriaMovimientoResponse])
def listar(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(CategoriaMovimiento)

    if q and q.strip():
        query = query.filter(
            CategoriaMovimiento.nombre.ilike(f"%{q}%")
        )

    total = query.count()

    items = (
        query.order_by(CategoriaMovimiento.id.desc())
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

# =========================
# OBTENER
# =========================
@router.get("/{id}", response_model=CategoriaMovimientoResponse)
def obtener_categoria(
    id: int,
    db: Session = Depends(get_db),
):
    categoria = db.get(CategoriaMovimiento, id)
    if not categoria:
        raise HTTPException(404, "Categoría no encontrada")
    return categoria

@router.post("/", response_model=CategoriaMovimientoResponse)
def crear(
    data: CategoriaMovimientoCreate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    categoria = CategoriaMovimiento(**data.model_dump())

    db.add(categoria)
    db.commit()
    db.refresh(categoria)

    db.add(Bitacora(
        entidad="CategoriaMovimiento",
        entidad_id=categoria.id,
        accion="CREATE",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return categoria


@router.put("/{id}", response_model=CategoriaMovimientoResponse)
def actualizar(
    id: int,
    data: CategoriaMovimientoUpdate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    categoria = db.get(CategoriaMovimiento, id)
    if not categoria:
        raise HTTPException(404, "Categoría no encontrada")

    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(categoria, k, v)

    db.commit()
    db.refresh(categoria)

    db.add(Bitacora(
        entidad="CategoriaMovimiento",
        entidad_id=id,
        accion="UPDATE",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return categoria


@router.patch("/{id}/anular")
def anular(
    id: int,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    categoria = db.get(CategoriaMovimiento, id)
    if not categoria:
        raise HTTPException(404, "Categoría no encontrada")

    categoria.activo = False

    db.add(Bitacora(
        entidad="CategoriaMovimiento",
        entidad_id=id,
        accion="ANULAR",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return {"ok": True}