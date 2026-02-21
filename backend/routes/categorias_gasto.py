# backend/routes/categorias_gasto.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models.models import CategoriaGasto
from schemas.categoria_gasto import CategoriaGastoCreate, CategoriaGastoUpdate, CategoriaGastoResponse
from schemas.common import Page

router = APIRouter(prefix="/categorias-gasto", tags=["Categorías de gasto"])


# =========================
# LISTAR (activas por defecto; opcional incluir inactivas)
# =========================
@router.get("/", response_model=Page[CategoriaGastoResponse])
def listar(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    solo_activas: bool = Query(True),
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(CategoriaGasto)
    if solo_activas:
        query = query.filter(CategoriaGasto.activo == True)
    if q and q.strip():
        query = query.filter(CategoriaGasto.nombre.ilike(f"%{q.strip()}%"))

    total = query.count()
    items = (
        query.order_by(CategoriaGasto.nombre.asc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )
    return {
        "items": items,
        "page": page,
        "size": size,
        "total": total,
        "pages": (total + size - 1) // size if total else 0,
    }


# =========================
# OBTENER POR ID
# =========================
@router.get("/{id}", response_model=CategoriaGastoResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    cat = db.get(CategoriaGasto, id)
    if not cat:
        raise HTTPException(404, "Categoría no encontrada")
    return cat


# =========================
# CREAR
# =========================
@router.post("/", response_model=CategoriaGastoResponse)
def crear(data: CategoriaGastoCreate, db: Session = Depends(get_db)):
    nombre = data.nombre.strip()
    existente = db.query(CategoriaGasto).filter(CategoriaGasto.nombre.ilike(nombre)).first()
    if existente:
        raise HTTPException(400, "Ya existe una categoría con ese nombre")
    cat = CategoriaGasto(nombre=nombre, activo=True)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


# =========================
# ACTUALIZAR
# =========================
@router.put("/{id}", response_model=CategoriaGastoResponse)
def actualizar(id: int, data: CategoriaGastoUpdate, db: Session = Depends(get_db)):
    cat = db.get(CategoriaGasto, id)
    if not cat:
        raise HTTPException(404, "Categoría no encontrada")
    update_data = data.model_dump(exclude_unset=True)
    if "nombre" in update_data and update_data["nombre"] is not None:
        nombre = update_data["nombre"].strip()
        otro = db.query(CategoriaGasto).filter(CategoriaGasto.nombre.ilike(nombre), CategoriaGasto.id != id).first()
        if otro:
            raise HTTPException(400, "Ya existe otra categoría con ese nombre")
        update_data["nombre"] = nombre
    for k, v in update_data.items():
        setattr(cat, k, v)
    db.commit()
    db.refresh(cat)
    return cat


# =========================
# DESACTIVAR
# =========================
@router.patch("/{id}/desactivar")
def desactivar(id: int, db: Session = Depends(get_db)):
    cat = db.get(CategoriaGasto, id)
    if not cat:
        raise HTTPException(404, "Categoría no encontrada")
    if not cat.activo:
        return {"ok": True}
    cat.activo = False
    db.commit()
    return {"ok": True}


# =========================
# ACTIVAR
# =========================
@router.patch("/{id}/activar")
def activar(id: int, db: Session = Depends(get_db)):
    cat = db.get(CategoriaGasto, id)
    if not cat:
        raise HTTPException(404, "Categoría no encontrada")
    if cat.activo:
        return {"ok": True}
    cat.activo = True
    db.commit()
    return {"ok": True}
