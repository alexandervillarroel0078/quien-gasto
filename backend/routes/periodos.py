# backend/routers/periodos.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models.models import Periodo
from schemas.periodo import PeriodoCreate, PeriodoResponse
from schemas.common import Page

router = APIRouter(prefix="/periodos", tags=["Periodos"])

# =========================
# LISTAR
# =========================
@router.get("/", response_model=Page[PeriodoResponse])
def listar(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Periodo)

    total = query.count()

    items = (
        query
        .order_by(Periodo.fecha_inicio.desc())
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
@router.post("/", response_model=PeriodoResponse)
def crear(
    data: PeriodoCreate,
    db: Session = Depends(get_db),
):
    periodo = Periodo(**data.model_dump())
    db.add(periodo)
    db.commit()
    db.refresh(periodo)
    return periodo

# =========================
# OBTENER
# =========================
@router.get("/{id}", response_model=PeriodoResponse)
def obtener(
    id: int,
    db: Session = Depends(get_db),
):
    periodo = db.get(Periodo, id)
    if not periodo:
        raise HTTPException(404, "Periodo no encontrado")
    return periodo

# =========================
# CERRAR
# =========================
@router.post("/{id}/cerrar")
def cerrar(
    id: int,
    db: Session = Depends(get_db),
):
    periodo = db.get(Periodo, id)
    if not periodo:
        raise HTTPException(404, "Periodo no encontrado")

    if periodo.cerrado:
        return {"ok": True, "mensaje": "Periodo ya estaba cerrado"}

    periodo.cerrado = True
    db.commit()

    return {"ok": True}
