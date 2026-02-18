# backend/routes/productos/inventarios.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.productos import Inventario
from schemas.producto.inventario_schema import (
    InventarioUpdate,
    InventarioDetailResponse,
)

router = APIRouter(prefix="/inventarios", tags=["Inventarios"])


@router.put("/{producto_id}", response_model=InventarioDetailResponse)
def actualizar(producto_id: int, data: InventarioUpdate, db: Session = Depends(get_db)):
    inv = db.query(Inventario).filter_by(producto_id=producto_id).first()
    if not inv:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(inv, k, v)
    db.commit()
    db.refresh(inv)
    return inv
