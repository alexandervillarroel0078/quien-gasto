# backend/routes/periodos.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models.models import Periodo, Aporte, Gasto
from schemas.common import Page
from schemas.periodo import PeriodoCreate, PeriodoUpdate, PeriodoResponse
from core.auth import get_current_user
from schemas.periodo import PeriodoLookup

router = APIRouter(prefix="/periodos", tags=["Periodos"])

@router.get("/lookup", response_model=list[PeriodoLookup])
def lookup_periodos(
    solo_abiertos: bool = Query(False),
    db: Session = Depends(get_db),
):
    query = db.query(Periodo.id, Periodo.nombre)

    if solo_abiertos:
        query = query.filter(Periodo.cerrado == False)

    return query.order_by(Periodo.fecha_inicio.desc()).all()
# =========================
# LISTAR
# =========================
@router.get("/", response_model=Page[PeriodoResponse])
def listar_periodos(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(Periodo)

    total = query.count()

    items = (
        query.order_by(Periodo.fecha_inicio.desc())
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
# LISTAR ABIERTOS
# =========================
@router.get("/abiertos", response_model=list[PeriodoResponse])
def listar_periodos_abiertos(
    db: Session = Depends(get_db),
):
    return (
        db.query(Periodo)
        .filter(Periodo.cerrado == False)
        .order_by(Periodo.fecha_inicio.desc())
        .all()
    )


# =========================
# CREAR
# =========================
@router.post("/", response_model=PeriodoResponse)
def crear_periodo(
    data: PeriodoCreate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    periodo = Periodo(**data.model_dump())
    db.add(periodo)
    db.commit()
    db.refresh(periodo)
    return periodo


# =========================
# ACTUALIZAR
# =========================
@router.patch("/{id}", response_model=PeriodoResponse)
def actualizar_periodo(
    id: int,
    data: PeriodoUpdate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    periodo = db.get(Periodo, id)
    if not periodo:
        raise HTTPException(404, "Periodo no encontrado")

    if periodo.cerrado:
        raise HTTPException(400, "Periodo cerrado")

    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(periodo, k, v)

    db.commit()
    db.refresh(periodo)
    return periodo


# =========================
# CERRAR
# =========================
@router.patch("/{id}/cerrar")
def cerrar_periodo(
    id: int,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
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
def reabrir_periodo(
    id: int,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    periodo = db.get(Periodo, id)
    if not periodo:
        raise HTTPException(404, "Periodo no encontrado")

    periodo.cerrado = False
    db.commit()
    return {"ok": True}


# =========================
# RESUMEN
# =========================
@router.get("/{id}/resumen")
def resumen_periodo(
    id: int,
    db: Session = Depends(get_db),
):
    periodo = db.get(Periodo, id)
    if not periodo:
        raise HTTPException(404, "Periodo no encontrado")

    total_aportes = (
        db.query(Aporte)
        .filter(
            Aporte.periodo_id == id,
            Aporte.estado == "ACTIVO"
        )
        .with_entities(Aporte.monto)
        .all()
    )

    total_gastos = (
        db.query(Gasto)
        .filter(
            Gasto.periodo_id == id,
            Gasto.estado == "ACTIVO"
        )
        .with_entities(Gasto.monto)
        .all()
    )

    suma_aportes = sum(a[0] for a in total_aportes)
    suma_gastos = sum(g[0] for g in total_gastos)

    return {
        "periodo": periodo.nombre,
        "aportes": suma_aportes,
        "gastos": suma_gastos,
        "balance": suma_aportes - suma_gastos,
    } 