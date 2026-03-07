from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal

from database import get_db
from models.models import Prestamo, PagoPrestamo, Persona
from schemas.prestamos.prestamo_schema import (
    PrestamoCreate,
    PrestamoResponse,
    PrestamoUpdate,
    PagoPrestamoCreate,
    PagoPrestamoResponse
)
from schemas.common import Page
from fastapi import Query

router = APIRouter(prefix="/prestamos", tags=["Prestamos"])

@router.post("/", response_model=PrestamoResponse)
def crear_prestamo(data: PrestamoCreate, db: Session = Depends(get_db)):

    prestamista = db.query(Persona).get(data.prestamista_id)
    deudor = db.query(Persona).get(data.deudor_id)

    if not prestamista or not deudor:
        raise HTTPException(status_code=404, detail="Persona no encontrada")

    prestamo = Prestamo(
        prestamista_id=data.prestamista_id,
        deudor_id=data.deudor_id,
        monto=data.monto,
        saldo_pendiente=data.monto,
        fecha=data.fecha,
        concepto=data.concepto,
        estado="ACTIVO"
    )

    db.add(prestamo)
    db.commit()
    db.refresh(prestamo)

    return prestamo

 
@router.get("/resumen")
def resumen_deudas(db: Session = Depends(get_db)):

    prestamos = db.query(Prestamo).filter(
        Prestamo.estado == "ACTIVO"
    ).all()

    resultado = {}

    for p in prestamos:

        key = (p.deudor_id, p.prestamista_id)

        if key not in resultado:
            resultado[key] = {
                "deudor_id": p.deudor_id,
                "acreedor_id": p.prestamista_id,
                "deudor": p.deudor.nombre,
                "acreedor": p.prestamista.nombre,
                "saldo": 0
            }

        resultado[key]["saldo"] += float(p.saldo_pendiente)

    return list(resultado.values())


@router.get("/historial/{deudor_id}/{acreedor_id}", response_model=List[PrestamoResponse])
def historial_deuda(
    deudor_id: int,
    acreedor_id: int,
    db: Session = Depends(get_db)
):
    from sqlalchemy.orm import joinedload

    prestamos = (
        db.query(Prestamo)
        .options(
            joinedload(Prestamo.prestamista),
            joinedload(Prestamo.deudor),
            joinedload(Prestamo.pagos),
        )
        .filter(
            Prestamo.deudor_id == deudor_id,
            Prestamo.prestamista_id == acreedor_id
        )
        .order_by(Prestamo.fecha.asc(), Prestamo.id.asc())
        .all()
    )

    return prestamos


@router.get("/{prestamo_id}", response_model=PrestamoResponse)
def obtener_prestamo(prestamo_id: int, db: Session = Depends(get_db)):

    prestamo = db.query(Prestamo).get(prestamo_id)

    if not prestamo:
        raise HTTPException(status_code=404, detail="Prestamo no encontrado")

    return prestamo


@router.post("/{prestamo_id}/pagos", response_model=PagoPrestamoResponse)
def registrar_pago_Prestamo (
    prestamo_id: int,
    data: PagoPrestamoCreate,
    db: Session = Depends(get_db)
):

    prestamo = db.query(Prestamo).get(prestamo_id)

    if not prestamo:
        raise HTTPException(status_code=404, detail="Prestamo no encontrado")

    if prestamo.estado != "ACTIVO":
        raise HTTPException(status_code=400, detail="Prestamo no activo")

    if data.monto > prestamo.saldo_pendiente:
        raise HTTPException(
            status_code=400,
            detail="El pago excede el saldo pendiente"
        )

    pago = PagoPrestamo(
        prestamo_id=prestamo_id,
        monto=data.monto,
        fecha=data.fecha,
        usuario_login_id=1
    )

    prestamo.saldo_pendiente -= data.monto

    if prestamo.saldo_pendiente == 0:
        prestamo.estado = "PAGADO"

    db.add(pago)
    db.commit()
    db.refresh(pago)

    return pago


 