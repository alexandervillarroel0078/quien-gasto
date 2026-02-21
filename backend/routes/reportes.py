# backend/routes/reportes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.models import Persona, Aporte, Gasto, Periodo, CategoriaGasto
from schemas.reportes import (
    BalanceResponse,
    ReporteAportesItem,
    ReporteGastosItem,
    ReportePersonaItem,
    ReporteGastoCategoriaItem,
    PeriodoCompararItem,
)

router = APIRouter(prefix="/reportes", tags=["Reportes"])


# =========================
# GET /reportes/balance
# =========================
@router.get("/balance", response_model=BalanceResponse)
def reporte_balance(
    periodo_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    if periodo_id is not None:
        periodo = db.get(Periodo, periodo_id)
        if not periodo:
            raise HTTPException(404, "Periodo no encontrado")
        total_aportes = (
            db.query(func.coalesce(func.sum(Aporte.monto), 0))
            .filter(Aporte.periodo_id == periodo_id, Aporte.estado == "ACTIVO")
            .scalar() or 0
        )
        total_gastos = (
            db.query(func.coalesce(func.sum(Gasto.monto), 0))
            .filter(Gasto.periodo_id == periodo_id, Gasto.estado == "ACTIVO")
            .scalar() or 0
        )
        return BalanceResponse(
            total_aportes=float(total_aportes),
            total_gastos=float(total_gastos),
            balance=float(total_aportes - total_gastos),
            periodo_id=periodo_id,
            periodo_nombre=periodo.nombre,
        )
    # Global: todos los periodos
    total_aportes = (
        db.query(func.coalesce(func.sum(Aporte.monto), 0)).filter(Aporte.estado == "ACTIVO").scalar() or 0
    )
    total_gastos = (
        db.query(func.coalesce(func.sum(Gasto.monto), 0)).filter(Gasto.estado == "ACTIVO").scalar() or 0
    )
    return BalanceResponse(
        total_aportes=float(total_aportes),
        total_gastos=float(total_gastos),
        balance=float(total_aportes - total_gastos),
    )


# =========================
# GET /reportes/aportes
# =========================
@router.get("/aportes", response_model=list[ReporteAportesItem])
def reporte_aportes(
    periodo_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    q = (
        db.query(
            Aporte.persona_id,
            Persona.nombre.label("persona_nombre"),
            Aporte.periodo_id,
            func.sum(Aporte.monto).label("total"),
            func.count(Aporte.id).label("cantidad"),
        )
        .join(Persona, Persona.id == Aporte.persona_id)
        .filter(Aporte.estado == "ACTIVO")
    )
    if periodo_id is not None:
        q = q.filter(Aporte.periodo_id == periodo_id)
    q = q.group_by(Aporte.persona_id, Persona.nombre, Aporte.periodo_id)
    rows = q.all()
    out = []
    for r in rows:
        periodo_nombre = None
        if r.periodo_id:
            p = db.get(Periodo, r.periodo_id)
            periodo_nombre = p.nombre if p else None
        out.append(
            ReporteAportesItem(
                periodo_id=r.periodo_id,
                periodo_nombre=periodo_nombre,
                persona_id=r.persona_id,
                persona_nombre=r.persona_nombre,
                total=float(r.total),
                cantidad=r.cantidad,
            )
        )
    return out


# =========================
# GET /reportes/gastos
# =========================
@router.get("/gastos", response_model=list[ReporteGastosItem])
def reporte_gastos(
    periodo_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    q = (
        db.query(
            Gasto.persona_id,
            Persona.nombre.label("persona_nombre"),
            Gasto.periodo_id,
            func.sum(Gasto.monto).label("total"),
            func.count(Gasto.id).label("cantidad"),
        )
        .join(Persona, Persona.id == Gasto.persona_id)
        .filter(Gasto.estado == "ACTIVO")
    )
    if periodo_id is not None:
        q = q.filter(Gasto.periodo_id == periodo_id)
    q = q.group_by(Gasto.persona_id, Persona.nombre, Gasto.periodo_id)
    rows = q.all()
    out = []
    for r in rows:
        periodo_nombre = None
        if r.periodo_id:
            p = db.get(Periodo, r.periodo_id)
            periodo_nombre = p.nombre if p else None
        out.append(
            ReporteGastosItem(
                periodo_id=r.periodo_id,
                periodo_nombre=periodo_nombre,
                persona_id=r.persona_id,
                persona_nombre=r.persona_nombre,
                total=float(r.total),
                cantidad=r.cantidad,
            )
        )
    return out


# =========================
# GET /reportes/personas
# =========================
@router.get("/personas", response_model=list[ReportePersonaItem])
def reporte_personas(
    periodo_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    aportes_sq = (
        db.query(
            Aporte.persona_id.label("persona_id"),
            func.coalesce(func.sum(Aporte.monto), 0).label("total_aportes"),
        )
        .filter(Aporte.estado == "ACTIVO")
        .group_by(Aporte.persona_id)
    )
    if periodo_id is not None:
        aportes_sq = aportes_sq.filter(Aporte.periodo_id == periodo_id)
    aportes_sq = aportes_sq.subquery()

    gastos_sq = (
        db.query(
            Gasto.persona_id.label("persona_id"),
            func.coalesce(func.sum(Gasto.monto), 0).label("total_gastos"),
        )
        .filter(Gasto.estado == "ACTIVO")
        .group_by(Gasto.persona_id)
    )
    if periodo_id is not None:
        gastos_sq = gastos_sq.filter(Gasto.periodo_id == periodo_id)
    gastos_sq = gastos_sq.subquery()

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
        ReportePersonaItem(
            persona_id=r.persona_id,
            nombre=r.nombre,
            total_aportes=float(r.total_aportes),
            total_gastos=float(r.total_gastos),
            balance=float(r.total_aportes - r.total_gastos),
        )
        for r in rows
    ]


# =========================
# GET /reportes/gastos/categorias
# =========================
@router.get("/gastos/categorias", response_model=list[ReporteGastoCategoriaItem])
def reporte_gastos_categorias(
    periodo_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    q = (
        db.query(
            Gasto.categoria_id,
            func.sum(Gasto.monto).label("total"),
            func.count(Gasto.id).label("cantidad"),
        )
        .filter(Gasto.estado == "ACTIVO")
    )
    if periodo_id is not None:
        q = q.filter(Gasto.periodo_id == periodo_id)
    q = q.group_by(Gasto.categoria_id)
    rows = q.all()
    out = []
    for r in rows:
        cat_nombre = None
        if r.categoria_id:
            cat = db.get(CategoriaGasto, r.categoria_id)
            cat_nombre = cat.nombre if cat else None
        out.append(
            ReporteGastoCategoriaItem(
                categoria_id=r.categoria_id,
                categoria_nombre=cat_nombre,
                total=float(r.total),
                cantidad=r.cantidad,
            )
        )
    return out


# =========================
# GET /reportes/periodos/comparar (definir antes que /periodos/{id}/balance)
# =========================
@router.get("/periodos/comparar", response_model=list[PeriodoCompararItem])
def reporte_periodos_comparar(
    ids: str = Query(..., description="Ids de periodos separados por coma, ej: 1,2,3"),
    db: Session = Depends(get_db),
):
    try:
        periodo_ids = [int(x.strip()) for x in ids.split(",") if x.strip()]
    except ValueError:
        raise HTTPException(400, "ids debe ser una lista de números separados por coma")
    if not periodo_ids:
        raise HTTPException(400, "Indique al menos un id de periodo")

    periodos = db.query(Periodo).filter(Periodo.id.in_(periodo_ids)).all()
    if len(periodos) != len(periodo_ids):
        raise HTTPException(404, "Uno o más periodos no encontrados")

    out = []
    for p in periodos:
        total_aportes = (
            db.query(func.coalesce(func.sum(Aporte.monto), 0))
            .filter(Aporte.periodo_id == p.id, Aporte.estado == "ACTIVO")
            .scalar() or 0
        )
        total_gastos = (
            db.query(func.coalesce(func.sum(Gasto.monto), 0))
            .filter(Gasto.periodo_id == p.id, Gasto.estado == "ACTIVO")
            .scalar() or 0
        )
        out.append(
            PeriodoCompararItem(
                periodo_id=p.id,
                periodo_nombre=p.nombre,
                total_aportes=float(total_aportes),
                total_gastos=float(total_gastos),
                balance=float(total_aportes - total_gastos),
            )
        )
    return out


# =========================
# GET /reportes/periodos/{id}/balance
# =========================
@router.get("/periodos/{id}/balance", response_model=BalanceResponse)
def reporte_periodo_balance(
    id: int,
    db: Session = Depends(get_db),
):
    periodo = db.get(Periodo, id)
    if not periodo:
        raise HTTPException(404, "Periodo no encontrado")
    total_aportes = (
        db.query(func.coalesce(func.sum(Aporte.monto), 0))
        .filter(Aporte.periodo_id == id, Aporte.estado == "ACTIVO")
        .scalar() or 0
    )
    total_gastos = (
        db.query(func.coalesce(func.sum(Gasto.monto), 0))
        .filter(Gasto.periodo_id == id, Gasto.estado == "ACTIVO")
        .scalar() or 0
    )
    return BalanceResponse(
        total_aportes=float(total_aportes),
        total_gastos=float(total_gastos),
        balance=float(total_aportes - total_gastos),
        periodo_id=id,
        periodo_nombre=periodo.nombre,
    )
