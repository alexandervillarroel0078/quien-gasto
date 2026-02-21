# backend/routers/gastos.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from database import get_db
from models.models import Gasto, Persona, Periodo, Bitacora
from schemas.gasto import GastoCreate, GastoUpdate, GastoResponse
from schemas.common import Page
from core.auth import get_current_user

router = APIRouter(prefix="/gastos", tags=["Gastos"])

# =========================
# LISTAR
# =========================
@router.get("/", response_model=Page[GastoResponse])
def listar_gastos(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    periodo_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Gasto).options(joinedload(Gasto.categoria)).join(Persona)

    if q and q.strip():
        query = query.filter(
            or_(
                Persona.nombre.ilike(f"%{q}%"),
                Gasto.concepto.ilike(f"%{q}%"),
            )
        )

    if periodo_id:
        query = query.filter(Gasto.periodo_id == periodo_id)

    total = query.count()

    items = (
        query.order_by(Gasto.fecha.desc(), Gasto.id.desc())
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
@router.post("/", response_model=GastoResponse)
def crear(
    data: GastoCreate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    if data.periodo_id:
        periodo = db.get(Periodo, data.periodo_id)
        if periodo and periodo.cerrado:
            raise HTTPException(400, "Periodo cerrado")

    gasto = Gasto(
        persona_id=usuario["persona_id"],        # ✅
        usuario_login_id=usuario["id"],           # ✅
        **data.model_dump()
    )

    db.add(gasto)
    db.commit()
    db.refresh(gasto)

    db.add(Bitacora(
        entidad="Gasto",
        entidad_id=gasto.id,
        accion="CREATE",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return gasto

# =========================
# OBTENER
# =========================
@router.get("/{id}", response_model=GastoResponse)
def obtener_gasto(
    id: int,
    db: Session = Depends(get_db),
):
    gasto = db.query(Gasto).options(joinedload(Gasto.categoria)).filter(Gasto.id == id).first()
    if not gasto:
        raise HTTPException(404, "Gasto no encontrado")
    return gasto

# =========================
# ACTUALIZAR
# =========================
@router.put("/{id}", response_model=GastoResponse)
def actualizar(
    id: int,
    data: GastoUpdate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    gasto = db.get(Gasto, id)
    if not gasto:
        raise HTTPException(404, "Gasto no encontrado")

    if gasto.usuario_login_id != usuario["id"]:
        raise HTTPException(403, "No autorizado")

    if gasto.periodo and gasto.periodo.cerrado:
        raise HTTPException(400, "Periodo cerrado")

    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(gasto, k, v)

    db.commit()
    db.refresh(gasto)

    db.add(Bitacora(
        entidad="Gasto",
        entidad_id=gasto.id,
        accion="UPDATE",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return gasto

# =========================
# ANULAR
# =========================
@router.patch("/{id}/anular")
def anular(
    id: int,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    gasto = db.get(Gasto, id)
    if not gasto:
        raise HTTPException(404, "Gasto no encontrado")
    if gasto.usuario_login_id != usuario["id"]:
        raise HTTPException(403, "No autorizado")
    if gasto.estado == "ANULADO":
        return {"ok": True, "mensaje": "Gasto ya estaba anulado"}
    gasto.estado = "ANULADO"
    db.add(Bitacora(
        entidad="Gasto",
        entidad_id=id,
        accion="ANULAR",
        usuario_id=usuario["id"],
    ))
    db.commit()
    return {"ok": True}
