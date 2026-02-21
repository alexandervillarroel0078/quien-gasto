# backend/routes/categorias_gasto.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models.models import CategoriaGasto
from schemas.common import Page
from schemas.categoria_gasto import CategoriaGastoCreate, CategoriaGastoResponse
from core.auth import get_current_user

router = APIRouter(prefix="/categorias-gasto", tags=["Categorias Gasto"])


# =========================
# LISTAR
# =========================
@router.get("/", response_model=Page[CategoriaGastoResponse])
def listar_categorias(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
    solo_activas: bool = Query(False),
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(CategoriaGasto)

    if solo_activas:
        query = query.filter(CategoriaGasto.activo == True)

    if q and q.strip():
        query = query.filter(
            CategoriaGasto.nombre.ilike(f"%{q}%")
        )

    total = query.count()

    items = (
        query.order_by(CategoriaGasto.nombre.asc())
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
# CREAR
# =========================
@router.post("/", response_model=CategoriaGastoResponse)
def crear_categoria(
    data: CategoriaGastoCreate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    categoria = CategoriaGasto(**data.model_dump())
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria