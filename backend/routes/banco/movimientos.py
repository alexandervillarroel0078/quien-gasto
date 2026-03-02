from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from database import get_db
from models.models import Periodo
from models.models import Movimiento, Cuenta, Bitacora
from schemas.banco.movimiento import (
    MovimientoCreate,
    MovimientoUpdate,
    MovimientoResponse,
)
from schemas.common import Page
from core.auth import get_current_user

router = APIRouter(prefix="/movimientos", tags=["Movimientos"])
from datetime import date, datetime, timedelta
from sqlalchemy import extract

from datetime import date
import calendar
from sqlalchemy import extract

from fastapi import Query, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import extract
from datetime import date
import calendar

@router.get("/", response_model=Page[MovimientoResponse])
def listar(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    cuenta_id: int | None = Query(None),
    persona_id: int | None = Query(None),
    estado: str | None = Query(None),  # 👈 NUEVO
    anio: int | None = Query(None),
    mes: int | None = Query(None, ge=1, le=12),
    semana_mes: int | None = Query(None, ge=1, le=5),
    dia: date | None = Query(None),
    db: Session = Depends(get_db),
):

    query = (
        db.query(Movimiento)
        .options(joinedload(Movimiento.cuenta))
        .options(joinedload(Movimiento.categoria))
        .options(joinedload(Movimiento.persona))
        .options(joinedload(Movimiento.periodo))
    )

    # ======================
    # Filtros básicos
    # ======================

    if cuenta_id is not None:
        query = query.filter(Movimiento.cuenta_id == cuenta_id)

    if persona_id is not None:
        query = query.filter(Movimiento.persona_id == persona_id)

    if estado:
        query = query.filter(Movimiento.estado == estado)

    if q:
        query = query.filter(
            Movimiento.concepto.ilike(f"%{q}%")
        )

    # ======================
    # Filtros por fecha
    # ======================

    if dia:
        query = query.filter(
            extract("year", Movimiento.fecha) == dia.year,
            extract("month", Movimiento.fecha) == dia.month,
            extract("day", Movimiento.fecha) == dia.day,
        )

    if anio:
        query = query.filter(
            extract("year", Movimiento.fecha) == anio
        )

    if mes:
        query = query.filter(
            extract("month", Movimiento.fecha) == mes
        )

    # ======================
    # Semana del mes
    # ======================

    if anio and mes and semana_mes is not None:
        inicio_dia = (semana_mes - 1) * 7 + 1
        fin_dia = semana_mes * 7

        ultimo_dia = calendar.monthrange(anio, mes)[1]
        fin_dia = min(fin_dia, ultimo_dia)

        fecha_inicio = date(anio, mes, inicio_dia)
        fecha_fin = date(anio, mes, fin_dia)

        query = query.filter(
            Movimiento.fecha >= fecha_inicio,
            Movimiento.fecha <= fecha_fin
        )

    # ======================
    # Paginación
    # ======================

    total = query.count()

    items = (
        query.order_by(Movimiento.fecha.desc(), Movimiento.id.desc())
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


@router.get("/{id}", response_model=MovimientoResponse)
def obtener_movimiento(
    id: int,
    db: Session = Depends(get_db),
):
    movimiento = (
        db.query(Movimiento)
        .options(joinedload(Movimiento.cuenta))
        .options(joinedload(Movimiento.categoria))
        .filter(Movimiento.id == id)
        .first()
    )

    if not movimiento:
        raise HTTPException(404, "Movimiento no encontrado")

    return movimiento


@router.post("/", response_model=MovimientoResponse)
def crear(
    data: MovimientoCreate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    cuenta = db.get(Cuenta, data.cuenta_id)
    if not cuenta:
        raise HTTPException(404, "Cuenta no encontrada")

    # =========================
    # 🔎 Buscar periodo automático
    # =========================
    periodo = (
        db.query(Periodo)
        .filter(
            Periodo.fecha_inicio <= data.fecha,
            Periodo.fecha_fin >= data.fecha
        )
        .first()
    )

    if not periodo:
        raise HTTPException(400, "No existe periodo para esa fecha")

    if periodo.cerrado:
        raise HTTPException(400, "El periodo está cerrado")

    # =========================
    # Crear movimiento
    # =========================
    movimiento = Movimiento(
        **data.model_dump(),
        usuario_login_id=usuario["id"],
        persona_id=usuario.get("persona_id"),
        periodo_id=periodo.id,
    )

    db.add(movimiento)
    db.commit()
    db.refresh(movimiento)

    # =========================
    # Bitácora
    # =========================
    db.add(Bitacora(
        entidad="Movimiento",
        entidad_id=movimiento.id,
        accion="CREATE",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return movimiento


@router.put("/{id}", response_model=MovimientoResponse)
def actualizar(
    id: int,
    data: MovimientoUpdate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    movimiento = db.get(Movimiento, id)
    if not movimiento:
        raise HTTPException(404, "Movimiento no encontrado")

    # 🔒 Bloquear si su periodo actual está cerrado
    if movimiento.periodo and movimiento.periodo.cerrado:
        raise HTTPException(400, "No se puede modificar un movimiento de un período cerrado")

    # 🔍 Si se cambia la fecha, validar nuevo periodo
    nueva_fecha = data.fecha if data.fecha else movimiento.fecha

    nuevo_periodo = (
        db.query(Periodo)
        .filter(
            Periodo.fecha_inicio <= nueva_fecha,
            Periodo.fecha_fin >= nueva_fecha
        )
        .first()
    )

    if not nuevo_periodo:
        raise HTTPException(400, "No existe período para esa fecha")

    if nuevo_periodo.cerrado:
        raise HTTPException(400, "El período de la nueva fecha está cerrado")

    # Aplicar cambios
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(movimiento, k, v)

    # Actualizar periodo automáticamente si cambió fecha
    movimiento.periodo_id = nuevo_periodo.id

    db.commit()
    db.refresh(movimiento)

    db.add(Bitacora(
        entidad="Movimiento",
        entidad_id=id,
        accion="UPDATE",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return movimiento


@router.patch("/{id}/anular")
def anular(
    id: int,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    movimiento = db.get(Movimiento, id)
    if not movimiento:
        raise HTTPException(404, "Movimiento no encontrado")

    if movimiento.periodo and movimiento.periodo.cerrado:
        raise HTTPException(400, "No se puede anular un movimiento de un período cerrado")

    if movimiento.estado == "ANULADO":
        return {"ok": True, "mensaje": "Ya estaba anulado"}

    movimiento.estado = "ANULADO"

    db.add(Bitacora(
        entidad="Movimiento",
        entidad_id=id,
        accion="ANULAR",
        usuario_id=usuario["id"],
    ))

    db.commit()

    return {"ok": True}



