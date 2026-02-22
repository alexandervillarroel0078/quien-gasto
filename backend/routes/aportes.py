# backend/routers/aportes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models.models import Aporte, Persona, Periodo, Bitacora
from schemas.aporte import AporteCreate, AporteUpdate, AporteResponse
from schemas.common import Page
from core.auth import get_current_user

router = APIRouter(prefix="/aportes", tags=["Aportes"])

@router.get("/", response_model=Page[AporteResponse])
def listar_aportes(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    periodo_id: int | None = Query(None),
    persona_id: int | None = Query(None),  # 👈 NUEVO
    db: Session = Depends(get_db),
):
    query = db.query(Aporte).join(Persona)

    # 🔍 filtro por persona
    if persona_id is not None:
        query = query.filter(Aporte.persona_id == persona_id)

    # 🔍 búsqueda textual
    if q and q.strip():
        q = q.strip()
        query = query.filter(
            or_(
                Persona.nombre.ilike(f"%{q}%"),
                Aporte.nota.ilike(f"%{q}%"),
            )
        )

    # 🗓️ filtro por periodo
    if periodo_id is not None:
        query = query.filter(Aporte.periodo_id == periodo_id)

    total = query.count()

    items = (
        query
        .order_by(Aporte.fecha.desc(), Aporte.id.desc())
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


@router.post("/", response_model=AporteResponse)
def crear(
    data: AporteCreate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    if data.periodo_id:
        periodo = db.get(Periodo, data.periodo_id)
        if periodo and periodo.cerrado:
            raise HTTPException(400, "Periodo cerrado")

    aporte = Aporte(
        persona_id=usuario["persona_id"],
        usuario_login_id=usuario["id"],
        **data.model_dump()
    )

    db.add(aporte)
    db.commit()
    db.refresh(aporte)

    db.add(Bitacora(
        entidad="Aporte",
        entidad_id=aporte.id,
        accion="CREATE",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return aporte

# =========================
# ANULAR
# =========================
@router.patch("/{id}/anular")
def anular(
    id: int,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    aporte = db.get(Aporte, id)
    if not aporte:
        raise HTTPException(404, "Aporte no encontrado")
    if aporte.usuario_login_id != usuario["id"]:
        raise HTTPException(403, "No autorizado")
    if aporte.estado == "ANULADO":
        return {"ok": True, "mensaje": "Aporte ya estaba anulado"}
    aporte.estado = "ANULADO"
    db.add(Bitacora(
        entidad="Aporte",
        entidad_id=id,
        accion="ANULAR",
        usuario_id=usuario["id"],
    ))
    db.commit()
    return {"ok": True}

@router.put("/{id}", response_model=AporteResponse)
def actualizar(
    id: int,
    data: AporteUpdate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    aporte = db.get(Aporte, id)
    if not aporte:
        raise HTTPException(404, "Aporte no encontrado")

    # 🔐 solo el dueño puede editar
    if aporte.usuario_login_id != usuario["id"]:
        raise HTTPException(403, "No autorizado")

    # 🔒 opcional: bloquear si periodo cerrado
    if aporte.periodo and aporte.periodo.cerrado:
        raise HTTPException(400, "Periodo cerrado")

    # aplicar cambios
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(aporte, k, v)

    db.commit()
    db.refresh(aporte)

    db.add(Bitacora(
        entidad="Aporte",
        entidad_id=aporte.id,
        accion="UPDATE",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return aporte