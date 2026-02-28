from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models.models import Cuenta, Bitacora
from schemas.banco.cuenta import (
    CuentaCreate,
    CuentaUpdate,
    CuentaResponse,
)
from schemas.common import Page
from core.auth import get_current_user

router = APIRouter(prefix="/cuentas", tags=["Cuentas"])

# =========================
# LOOKUP CUENTAS (ID + NOMBRE)
# =========================
@router.get("/lookup")
def lookup_cuentas(
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Cuenta.id, Cuenta.nombre).filter(Cuenta.activo == True)

    if q and q.strip():
        query = query.filter(
            Cuenta.nombre.ilike(f"%{q.strip()}%")
        )

    cuentas = query.order_by(Cuenta.nombre.asc()).all()

    return [
        {"id": c.id, "nombre": c.nombre}
        for c in cuentas
    ]
# =========================
# LISTAR
# =========================
@router.get("/", response_model=Page[CuentaResponse])
def listar_cuentas(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Cuenta)

    if q and q.strip():
        q = q.strip()
        query = query.filter(
            or_(
                Cuenta.nombre.ilike(f"%{q}%"),
                Cuenta.banco.ilike(f"%{q}%"),
            )
        )

    total = query.count()

    items = (
        query.order_by(Cuenta.id.desc())
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
# OBTENER
# =========================
@router.get("/{id}", response_model=CuentaResponse)
def obtener_cuenta(
    id: int,
    db: Session = Depends(get_db),
):
    cuenta = db.get(Cuenta, id)
    if not cuenta:
        raise HTTPException(404, "Cuenta no encontrada")
    return cuenta

# =========================
# CREAR
# =========================
@router.post("/", response_model=CuentaResponse)
def crear(
    data: CuentaCreate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    cuenta = Cuenta(**data.model_dump())

    db.add(cuenta)
    db.commit()
    db.refresh(cuenta)

    db.add(Bitacora(
        entidad="Cuenta",
        entidad_id=cuenta.id,
        accion="CREATE",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return cuenta


# =========================
# ACTUALIZAR
# =========================
@router.put("/{id}", response_model=CuentaResponse)
def actualizar(
    id: int,
    data: CuentaUpdate,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    cuenta = db.get(Cuenta, id)
    if not cuenta:
        raise HTTPException(404, "Cuenta no encontrada")

    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(cuenta, k, v)

    db.commit()
    db.refresh(cuenta)

    db.add(Bitacora(
        entidad="Cuenta",
        entidad_id=id,
        accion="UPDATE",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return cuenta


# =========================
# ANULAR
# =========================
@router.patch("/{id}/anular")
def anular(
    id: int,
    db: Session = Depends(get_db),
    usuario: dict = Depends(get_current_user),
):
    cuenta = db.get(Cuenta, id)
    if not cuenta:
        raise HTTPException(404, "Cuenta no encontrada")

    cuenta.activo = False

    db.add(Bitacora(
        entidad="Cuenta",
        entidad_id=id,
        accion="ANULAR",
        usuario_id=usuario["id"],
    ))
    db.commit()

    return {"ok": True}