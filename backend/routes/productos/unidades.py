# backend\routes\productos\unidades.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.productos import UnidadMedida
from schemas.producto.unidad_medida_schema import (
    UnidadMedidaCreate,
    UnidadMedidaUpdate,
    UnidadMedidaListResponse,
    UnidadMedidaDetailResponse,
)

from fastapi import Query
from schemas.common import Page

router = APIRouter(prefix="/unidades", tags=["Unidades de Medida"])

@router.post("/", response_model=UnidadMedidaDetailResponse)
def crear(data: UnidadMedidaCreate, db: Session = Depends(get_db)):
    obj = UnidadMedida(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/", response_model=Page[UnidadMedidaListResponse])
def listar_unidades(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(UnidadMedida)

    if q:
        query = query.filter(
            (UnidadMedida.nombre.ilike(f"%{q}%")) |
            (UnidadMedida.abreviatura.ilike(f"%{q}%"))
        )

    total = query.count()
    items = query.order_by(UnidadMedida.nombre)\
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


@router.get("/{id}", response_model=UnidadMedidaDetailResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    obj = db.get(UnidadMedida, id)
    if not obj:
        raise HTTPException(404)
    return obj


@router.put("/{id}", response_model=UnidadMedidaDetailResponse)
def actualizar(id: int, data: UnidadMedidaUpdate, db: Session = Depends(get_db)):
    obj = db.get(UnidadMedida, id)
    if not obj:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.get(UnidadMedida, id)
    if not obj:
        raise HTTPException(404)
    db.delete(obj)
    db.commit()
