# backend/routes/periodos.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.models import Periodo, Persona, Aporte, Gasto
from schemas.periodo import PeriodoCreate, PeriodoUpdate, PeriodoResponse
from schemas.common import Page
from schemas.resumen import ResumenPersonaResponse

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
# ACTUALIZAR (PATCH)
# =========================
@router.patch("/{id}", response_model=PeriodoResponse)
def actualizar(
    id: int,
    data: PeriodoUpdate,
    db: Session = Depends(get_db),
):
    periodo = db.get(Periodo, id)
    if not periodo:
        raise HTTPException(404, "Periodo no encontrado")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(periodo, k, v)
    db.commit()
    db.refresh(periodo)
    return periodo


# =========================
# CERRAR
# =========================
@router.patch("/{id}/cerrar")
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


# =========================
# REABRIR
# =========================
@router.patch("/{id}/reabrir")
def reabrir(
    id: int,
    db: Session = Depends(get_db),
):
    periodo = db.get(Periodo, id)
    if not periodo:
        raise HTTPException(404, "Periodo no encontrado")
    if not periodo.cerrado:
        return {"ok": True, "mensaje": "Periodo ya estaba abierto"}
    periodo.cerrado = False
    db.commit()
    return {"ok": True}


# =========================
# RESUMEN DEL PERÍODO
# =========================
@router.get("/{id}/resumen", response_model=list[ResumenPersonaResponse])
def resumen_periodo(
    id: int,
    db: Session = Depends(get_db),
):
    periodo = db.get(Periodo, id)
    if not periodo:
        raise HTTPException(404, "Periodo no encontrado")
    aportes_sq = (
        db.query(
            Aporte.persona_id.label("persona_id"),
            func.coalesce(func.sum(Aporte.monto), 0).label("total_aportes"),
        )
        .filter(Aporte.periodo_id == id, Aporte.estado == "ACTIVO")
        .group_by(Aporte.persona_id)
        .subquery()
    )
    gastos_sq = (
        db.query(
            Gasto.persona_id.label("persona_id"),
            func.coalesce(func.sum(Gasto.monto), 0).label("total_gastos"),
        )
        .filter(Gasto.periodo_id == id, Gasto.estado == "ACTIVO")
        .group_by(Gasto.persona_id)
        .subquery()
    )
    rows = (
        db.query(
            Persona.id.label("persona_id"),
            Persona.nombre,
            func.coalesce(aportes_sq.c.total_aportes, 0).label("total_aportes"),
            func.coalesce(gastos_sq.c.total_gastos, 0).label("total_gastos"),
        )
        .outerjoin(aportes_sq, aportes_sq.c.persona_id == Persona.id)
        .outerjoin(gastos_sq, gastos_sq.c.persona_id == Persona.id)
        .filter(Persona.activo == True)
        .order_by(Persona.nombre.asc())
        .all()
    )
    return [
        ResumenPersonaResponse(
            persona_id=r.persona_id,
            nombre=r.nombre,
            total_aportes=float(r.total_aportes),
            total_gastos=float(r.total_gastos),
            balance=float(r.total_aportes - r.total_gastos),
        )
        for r in rows
    ]
