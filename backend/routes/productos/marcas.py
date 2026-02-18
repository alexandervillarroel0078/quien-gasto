# backend/routes/productos/marcas.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.productos import Marca
from schemas.producto.marca_schema import (
    MarcaCreate,
    MarcaUpdate,
    MarcaListResponse,
    MarcaDetailResponse,
)
from fastapi import Query
from schemas.common import Page

router = APIRouter(prefix="/marcas", tags=["Marcas"])


@router.post("/", response_model=MarcaDetailResponse)
def crear(data: MarcaCreate, db: Session = Depends(get_db)):
    obj = Marca(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/", response_model=Page[MarcaListResponse])
def listar_marcas(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Marca)

    if q:
        query = query.filter(Marca.nombre.ilike(f"%{q}%"))

    total = query.count()
    items = query.order_by(Marca.nombre)\
                 .offset((page - 1) * size)\
                 .limit(size)\
                 .all()

    return {
        "items": items,
        "page": page,
        "size": size,
        "total": total,
        "pages": (total + size - 1) // size,
    }



@router.get("/{id}", response_model=MarcaDetailResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    obj = db.get(Marca, id)
    if not obj:
        raise HTTPException(404)
    return obj


@router.put("/{id}", response_model=MarcaDetailResponse)
def actualizar(id: int, data: MarcaUpdate, db: Session = Depends(get_db)):
    obj = db.get(Marca, id)
    if not obj:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.get(Marca, id)
    if not obj:
        raise HTTPException(404)
    db.delete(obj)
    db.commit()
