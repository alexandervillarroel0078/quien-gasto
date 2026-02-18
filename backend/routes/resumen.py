from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.models import Persona, Aporte, Gasto, Periodo
from schemas.resumen import ResumenPersonaResponse

router = APIRouter(prefix="/resumen", tags=["Resumen"])


@router.get(
    "/periodo/{periodo_id}",
    response_model=list[ResumenPersonaResponse]
)
def resumen_por_periodo(
    periodo_id: int,
    db: Session = Depends(get_db),
):
    # ======================
    # Validar periodo
    # ======================
    periodo = db.get(Periodo, periodo_id)
    if not periodo:
        raise HTTPException(status_code=404, detail="Periodo no encontrado")

    # ======================
    # Subquery aportes
    # ======================
    aportes_sq = (
        db.query(
            Aporte.persona_id.label("persona_id"),
            func.coalesce(func.sum(Aporte.monto), 0).label("total_aportes")
        )
        .filter(Aporte.periodo_id == periodo_id)
        .group_by(Aporte.persona_id)
        .subquery()
    )

    # ======================
    # Subquery gastos
    # ======================
    gastos_sq = (
        db.query(
            Gasto.persona_id.label("persona_id"),
            func.coalesce(func.sum(Gasto.monto), 0).label("total_gastos")
        )
        .filter(Gasto.periodo_id == periodo_id)
        .group_by(Gasto.persona_id)
        .subquery()
    )

    # ======================
    # Query final
    # ======================
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

    # ======================
    # Respuesta
    # ======================
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
