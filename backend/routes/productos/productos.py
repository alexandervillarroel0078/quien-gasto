from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from database import get_db
from models.productos import Producto, ProductoPrecio, Inventario
from schemas.producto.producto_schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoListResponse,
    ProductoDetailResponse,
)
from schemas.common import Page

router = APIRouter(prefix="/productos", tags=["Productos"])

# =====================================================
# LOOKUP PRODUCTOS (PARA SELECTS ERP)
# =====================================================
@router.get("/lookup")
def lookup_productos(
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Producto).filter(Producto.activo == True)

    if q and q.strip():
        query = query.filter(
            or_(
                Producto.nombre.ilike(f"%{q}%"),
                Producto.codigo_interno.ilike(f"%{q}%"),
                Producto.codigo_barra.ilike(f"%{q}%"),
            )
        )

    productos = (
        query
        .order_by(Producto.nombre)
        .limit(1000)   # 👈 límite seguro
        .all()
    )

    return [
        {
            "id": p.id,
            "nombre": p.nombre,
            "codigo": p.codigo_interno,
        }
        for p in productos
    ]

# =====================================================
# CREAR PRODUCTO
# =====================================================
@router.post("/", response_model=ProductoDetailResponse, status_code=status.HTTP_201_CREATED)
def crear_producto(data: ProductoCreate, db: Session = Depends(get_db)):
    existe = db.query(Producto).filter_by(
        codigo_interno=data.codigo_interno
    ).first()
    if existe:
        raise HTTPException(400, detail="codigo_interno ya existe")

    producto = Producto(
        codigo_interno=data.codigo_interno,
        codigo_barra=data.codigo_barra,
        nombre=data.nombre,
        descripcion=data.descripcion,
        unidad_medida_id=data.unidad_medida_id,
        marca_id=data.marca_id,
        categoria_id=data.categoria_id,
        activo=True,
    )

    db.add(producto)
    db.flush()

    db.add(
        ProductoPrecio(
            producto_id=producto.id,
            costo_promedio=0,
            precio_base=data.precio_base,
            precio_min=data.precio_min,
            precio_max=data.precio_max,
        )
    )

    db.add(
        Inventario(
            producto_id=producto.id,
            stock_actual=0,
        )
    )

    db.commit()
    return _producto_detail(producto)


# =====================================================
# LISTAR PRODUCTOS
# =====================================================
@router.get("/", response_model=Page[ProductoListResponse])
def listar_productos(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Producto)

    if q:
        query = query.filter(
            or_(
                Producto.codigo_interno.ilike(f"%{q}%"),
                Producto.nombre.ilike(f"%{q}%"),
                Producto.codigo_barra.ilike(f"%{q}%"),
            )
        )

    total = query.count()

    productos = (
        query
        .options(
            joinedload(Producto.precios),
            joinedload(Producto.inventarios),
            joinedload(Producto.unidad_medida),
            joinedload(Producto.marca),
            joinedload(Producto.categoria),
        )
        .order_by(
            Producto.activo.desc(),
            Producto.nombre
        )
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    items = [_producto_list(p) for p in productos]

    return {
        "items": items,
        "page": page,
        "size": size,
        "total": total,
        "pages": (total + size - 1) // size,
    }


# =====================================================
# OBTENER PRODUCTO
# =====================================================
@router.get("/{id}", response_model=ProductoDetailResponse)
def obtener_producto(id: int, db: Session = Depends(get_db)):
    producto = (
        db.query(Producto)
        .options(
            joinedload(Producto.precios),
            joinedload(Producto.inventarios),
            joinedload(Producto.unidad_medida),
            joinedload(Producto.marca),
            joinedload(Producto.categoria),
        )
        .filter(Producto.id == id)
        .first()
    )

    if not producto:
        raise HTTPException(404, detail="Producto no encontrado")

    return _producto_detail(producto)


# =====================================================
# ACTUALIZAR PRODUCTO
# =====================================================
@router.put("/{id}", response_model=ProductoDetailResponse)
def actualizar_producto(
    id: int,
    data: ProductoUpdate,
    db: Session = Depends(get_db),
):
    producto = db.get(Producto, id)
    if not producto:
        raise HTTPException(404, detail="Producto no encontrado")

    payload = data.model_dump(exclude_unset=True)

    # datos del producto
    for campo in [
        "codigo_interno", "codigo_barra", "nombre",
        "descripcion", "unidad_medida_id",
        "marca_id", "categoria_id"
    ]:
        if campo in payload:
            setattr(producto, campo, payload[campo])

    # precios
    if any(k in payload for k in ("precio_base", "precio_min", "precio_max")):
        precio = producto.precios[0]
        if "precio_base" in payload:
            precio.precio_base = payload["precio_base"]
        if "precio_min" in payload:
            precio.precio_min = payload["precio_min"]
        if "precio_max" in payload:
            precio.precio_max = payload["precio_max"]

    db.commit()
    return _producto_detail(producto)


# =====================================================
# ACTIVAR / DESACTIVAR
# =====================================================
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def desactivar_producto(id: int, db: Session = Depends(get_db)):
    producto = db.get(Producto, id)
    if not producto:
        raise HTTPException(404, detail="Producto no encontrado")

    producto.activo = False
    db.commit()


@router.post("/{id}/activar", response_model=ProductoDetailResponse)
def activar_producto(id: int, db: Session = Depends(get_db)):
    producto = db.get(Producto, id)
    if not producto:
        raise HTTPException(404, detail="Producto no encontrado")

    producto.activo = True
    db.commit()
    return _producto_detail(producto)


# =====================================================
# HELPERS
# =====================================================
def _producto_list(p: Producto):
    precio = p.precios[0] if p.precios else None
    inv = p.inventarios[0] if p.inventarios else None

    return {
        "id": p.id,
        "codigo_interno": p.codigo_interno,
        "nombre": p.nombre,
        "activo": p.activo,
        "precio_base": precio.precio_base if precio else 0,
        "stock": inv.stock_actual if inv else 0,
        "unidad": p.unidad_medida,
        "marca": p.marca,
        "categoria": p.categoria,
    }


def _producto_detail(p: Producto):
    precio = p.precios[0]
    inv = p.inventarios[0]

    return {
        "id": p.id,
        "codigo_interno": p.codigo_interno,
        "codigo_barra": p.codigo_barra,
        "nombre": p.nombre,
        "descripcion": p.descripcion,
        "activo": p.activo,
        "precio_base": precio.precio_base,
        "precio_min": precio.precio_min,
        "precio_max": precio.precio_max,
        "costo_promedio": precio.costo_promedio,
        "stock": inv.stock_actual,
        "unidad": p.unidad_medida,
        "marca": p.marca,
        "categoria": p.categoria,
    }


