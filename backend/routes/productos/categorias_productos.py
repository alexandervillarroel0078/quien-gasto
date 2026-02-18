# backend/routes/productos/categorias.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.productos import Categoria
from schemas.producto.categoria_schema import (
    CategoriaCreate,
    CategoriaUpdate,
    CategoriaListResponse,
    CategoriaDetailResponse,
)
from fastapi import Query
from schemas.common import Page

router = APIRouter(prefix="/categorias-productos", tags=["Categorias Productos"])


@router.post("/", response_model=CategoriaDetailResponse)
def crear(data: CategoriaCreate, db: Session = Depends(get_db)):
    obj = Categoria(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/", response_model=Page[CategoriaListResponse])
def listar_categorias(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Categoria)

    if q:
        query = query.filter(Categoria.nombre.ilike(f"%{q}%"))

    total = query.count()
    items = query.order_by(Categoria.nombre)\
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




@router.get("/{id}", response_model=CategoriaDetailResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    obj = db.get(Categoria, id)
    if not obj:
        raise HTTPException(404)
    return obj


@router.put("/{id}", response_model=CategoriaDetailResponse)
def actualizar(id: int, data: CategoriaUpdate, db: Session = Depends(get_db)):
    obj = db.get(Categoria, id)
    if not obj:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.get(Categoria, id)
    if not obj:
        raise HTTPException(404)
    db.delete(obj)
    db.commit()
