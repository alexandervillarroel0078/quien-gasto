from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.models import Persona, Aporte, Gasto, Periodo
from schemas.resumen import ResumenPersonaResponse

router = APIRouter(prefix="/resumen", tags=["Resumen"])


@router.get("/periodo/{periodo_id}", response_model=list[ResumenPersonaResponse])
def resumen_por_periodo(
    periodo_id: int,
    db: Session = Depends(get_db),
):
    periodo = db.get(Periodo, periodo_id)
    if not periodo:
        raise HTTPException(404, "Periodo no encontrado")

    personas = db.query(Persona).filter(Persona.activo == True).all()

    resultado = []

    for persona in personas:
        total_aportes = (
            db.query(func.coalesce(func.sum(Aporte.monto), 0))
            .filter(
                Aporte.persona_id == persona.id,
                Aporte.periodo_id == periodo_id
            )
            .scalar()
        )

        total_gastos = (
            db.query(func.coalesce(func.sum(Gasto.monto), 0))
            .filter(
                Gasto.persona_id == persona.id,
                Gasto.periodo_id == periodo_id
            )
            .scalar()
        )

        resultado.append({
            "persona_id": persona.id,
            "nombre": persona.nombre,
            "total_aportes": total_aportes,
            "total_gastos": total_gastos,
            "balance": total_aportes - total_gastos
        })

    return resultado
