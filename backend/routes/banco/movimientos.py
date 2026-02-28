from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from database import get_db
from models.models import Movimiento, Cuenta, Bitacora
from schemas.banco.movimiento import (
    MovimientoCreate,
    MovimientoUpdate,
    MovimientoResponse,
)
from schemas.common import Page
from core.auth import get_current_user

router = APIRouter(prefix="/movimientos", tags=["Movimientos"])


@router.get("/", response_model=Page[MovimientoResponse])
def listar(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    cuenta_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Movimiento)
        .options(joinedload(Movimiento.cuenta))
        .options(joinedload(Movimiento.categoria))
    )

    if cuenta_id is not None:
        query = query.filter(Movimiento.cuenta_id == cuenta_id)

    if q and q.strip():
        query = query.filter(
            Movimiento.concepto.ilike(f"%{q}%")
        )

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

# =========================
# OBTENER
# =========================
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

    movimiento = Movimiento(**data.model_dump())

    db.add(movimiento)
    db.commit()
    db.refresh(movimiento)

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

    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(movimiento, k, v)

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

    movimiento.estado = "ANULADO"

    db.add(Bitacora(
        entidad="Movimiento",
        entidad_id=id,
        accion="ANULAR",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return {"ok": True}