# backend\routes\productos\producto_precio.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.productos import ProductoPrecio
from schemas.producto.producto_precio_schema import (
    ProductoPrecioUpdate,
    ProductoPrecioDetailResponse,
)

router = APIRouter(prefix="/productos-precio", tags=["Producto Precio"])


@router.put("/{producto_id}", response_model=ProductoPrecioDetailResponse)
def actualizar(producto_id: int, data: ProductoPrecioUpdate, db: Session = Depends(get_db)):
    precio = db.query(ProductoPrecio).filter_by(producto_id=producto_id).first()
    if not precio:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(precio, k, v)
    db.commit()
    db.refresh(precio)
    return precio
