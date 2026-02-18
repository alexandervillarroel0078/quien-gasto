from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models.models import Gasto, Persona, Periodo, Bitacora
from schemas.gasto import GastoCreate, GastoUpdate, GastoResponse
from schemas.common import Page
from core.auth import get_current_user

router = APIRouter(prefix="/gastos", tags=["Gastos"])


# =========================
# LISTAR (paginado + filtros)
# =========================
@router.get("/", response_model=Page[GastoResponse])
def listar_gastos(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    periodo_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Gasto)
        .join(Persona, Gasto.persona_id == Persona.id)
    )

    # 🔎 búsqueda
    if q and q.strip():
        query = query.filter(
            or_(
                Persona.nombre.ilike(f"%{q}%"),
                Gasto.concepto.ilike(f"%{q}%"),
            )
        )

    # 📆 filtro por periodo
    if periodo_id:
        query = query.filter(Gasto.periodo_id == periodo_id)

    total = query.count()

    items = (
        query
        .order_by(Gasto.fecha.desc(), Gasto.id.desc())
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
    usuario=Depends(get_current_user),
):
    if data.periodo_id:
        periodo = db.get(Periodo, data.periodo_id)
        if periodo and periodo.cerrado:
            raise HTTPException(400, "Periodo cerrado")

    gasto = Gasto(
        persona_id=usuario.persona_id,
        usuario_login_id=usuario.id,
        **data.model_dump()
    )

    db.add(gasto)
    db.commit()
    db.refresh(gasto)

    db.add(Bitacora(
        entidad="Gasto",
        entidad_id=gasto.id,
        accion="CREATE",
        usuario_id=usuario.id,
    ))
    db.commit()

    return gasto


# =========================
# OBTENER POR ID
# =========================
@router.get("/{id}", response_model=GastoResponse)
def obtener_gasto(
    id: int,
    db: Session = Depends(get_db),
):
    gasto = db.get(Gasto, id)
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
    usuario=Depends(get_current_user),
):
    gasto = db.get(Gasto, id)
    if not gasto:
        raise HTTPException(404, "Gasto no encontrado")

    # 🔐 ownership
    if gasto.usuario_login_id != usuario.id:
        raise HTTPException(403, "No autorizado")

    # 🔒 periodo cerrado
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
        usuario_id=usuario.id,
    ))
    db.commit()

    return gasto


# =========================
# ELIMINAR
# =========================
@router.delete("/{id}")
def eliminar(
    id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user),
):
    gasto = db.get(Gasto, id)
    if not gasto or gasto.usuario_login_id != usuario.id:
        raise HTTPException(403, "No autorizado")

    # opcional: bloquear si periodo cerrado
    if gasto.periodo and gasto.periodo.cerrado:
        raise HTTPException(400, "Periodo cerrado")

    db.delete(gasto)

    db.add(Bitacora(
        entidad="Gasto",
        entidad_id=id,
        accion="DELETE",
        usuario_id=usuario.id,
    ))
    db.commit()

    return {"ok": True}
