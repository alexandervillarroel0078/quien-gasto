from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.models import Persona
from schemas.persona import PersonaCreate, PersonaUpdate, PersonaResponse
from fastapi import Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from schemas.common import Page


router = APIRouter(prefix="/personas", tags=["Personas"])




# =========================
# LISTAR PERSONAS ACTIVAS
# =========================
@router.get("/", response_model=Page[PersonaResponse])
def listar_personas(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Persona).filter(Persona.activo == True)

    if q and q.strip():
        query = query.filter(Persona.nombre.ilike(f"%{q.strip()}%"))

    total = query.count()

    items = (
        query
        .order_by(Persona.nombre.asc(), Persona.id.asc())
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
# OBTENER POR ID
# =========================
@router.get("/{id}", response_model=PersonaResponse)
def obtener(
    id: int,
    db: Session = Depends(get_db),
):
    persona = db.get(Persona, id)
    if not persona:
        raise HTTPException(404, "Persona no encontrada")
    return persona


# =========================
# CREAR
# =========================
@router.post("/", response_model=PersonaResponse)
def crear(
    data: PersonaCreate,
    db: Session = Depends(get_db),
):
    persona = Persona(
        nombre=data.nombre.strip(),
        activo=True,
    )
    db.add(persona)
    db.commit()
    db.refresh(persona)
    return persona


# =========================
# ACTUALIZAR
# =========================
@router.put("/{id}", response_model=PersonaResponse)
def actualizar(
    id: int,
    data: PersonaUpdate,
    db: Session = Depends(get_db),
):
    persona = db.get(Persona, id)
    if not persona:
        raise HTTPException(404, "Persona no encontrada")

    update_data = data.model_dump(exclude_unset=True)
    if "nombre" in update_data and update_data["nombre"] is not None:
        update_data["nombre"] = update_data["nombre"].strip()

    for k, v in update_data.items():
        setattr(persona, k, v)

    db.commit()
    db.refresh(persona)
    return persona


# =========================
# DESACTIVAR
# =========================
@router.patch("/{id}/desactivar")
def desactivar(
    id: int,
    db: Session = Depends(get_db),
):
    persona = db.get(Persona, id)
    if not persona:
        raise HTTPException(404, "Persona no encontrada")

    if not persona.activo:
        return {"ok": True}

    persona.activo = False
    db.commit()
    return {"ok": True}


# =========================
# ACTIVAR
# =========================
@router.patch("/{id}/activar")
def activar(
    id: int,
    db: Session = Depends(get_db),
):
    persona = db.get(Persona, id)
    if not persona:
        raise HTTPException(404, "Persona no encontrada")

    if persona.activo:
        return {"ok": True}

    persona.activo = True
    db.commit()
    return {"ok": True}
