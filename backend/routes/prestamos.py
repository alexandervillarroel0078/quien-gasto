

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.models import Prestamo, PagoPrestamo, Persona, EstadoPrestamoEnum
from schemas.prestamos.prestamo_schema import (
    PrestamoCreate,
    PrestamoResponse,
    PrestamoUpdate,
    PagoPrestamoCreate,
    PagoPrestamoResponse
)
from core.auth import get_current_user
from sqlalchemy import or_
from sqlalchemy import or_, and_
from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/prestamos", tags=["Prestamos"])


# =========================
# CREAR PRESTAMO
# =========================
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
        estado=EstadoPrestamoEnum.ACTIVO
    )

    db.add(prestamo)
    db.commit()
    db.refresh(prestamo)

    return prestamo

@router.get("/resumen")
def resumen_deudas(
    persona_id: int | None = Query(None),
    estado: EstadoPrestamoEnum | None = Query(None),
    db: Session = Depends(get_db),
    usuario = Depends(get_current_user)
):

    if not persona_id:
        persona_id = usuario["persona_id"]

    query = db.query(Prestamo).filter(
        or_(
            Prestamo.deudor_id == persona_id,
            Prestamo.prestamista_id == persona_id
        )
    )

    # filtro por estado
    if estado:
        query = query.filter(Prestamo.estado == estado)

    prestamos = query.all()

    me_deben = {}
    yo_debo = {}

    for p in prestamos:

        # =========================
        # ME DEBEN
        # =========================
        if p.prestamista_id == persona_id:

            key = p.deudor_id

            if key not in me_deben:
                me_deben[key] = {
                    "persona_id": p.deudor_id,
                    "nombre": p.deudor.nombre,
                    "saldo": 0,
                    "estado": p.estado,
                    "deudor_id": p.deudor_id,
                    "acreedor_id": p.prestamista_id
                }

            me_deben[key]["saldo"] += float(p.saldo_pendiente)

        # =========================
        # YO DEBO
        # =========================
        if p.deudor_id == persona_id:

            key = p.prestamista_id

            if key not in yo_debo:
                yo_debo[key] = {
                    "persona_id": p.prestamista_id,
                    "nombre": p.prestamista.nombre,
                    "saldo": 0,
                    "estado": p.estado,
                    "deudor_id": p.deudor_id,
                    "acreedor_id": p.prestamista_id
                }

            yo_debo[key]["saldo"] += float(p.saldo_pendiente)

    return {
        "me_deben": list(me_deben.values()),
        "yo_debo": list(yo_debo.values())
    }


# =========================
# HISTORIAL DEUDA
# =========================
# @router.get("/historial/{deudor_id}/{acreedor_id}", response_model=List[PrestamoResponse])
# def historial_deuda(
#     deudor_id: int,
#     acreedor_id: int,
#     db: Session = Depends(get_db)
# ):

#     prestamos = (
#         db.query(Prestamo)
#         .options(
#             joinedload(Prestamo.prestamista),
#             joinedload(Prestamo.deudor),
#             joinedload(Prestamo.pagos),
#         )
#         .filter(
#             Prestamo.estado == EstadoPrestamoEnum.ACTIVO,
#             or_(
#                 and_(
#                     Prestamo.deudor_id == deudor_id,
#                     Prestamo.prestamista_id == acreedor_id
#                 ),
#                 and_(
#                     Prestamo.deudor_id == acreedor_id,
#                     Prestamo.prestamista_id == deudor_id
#                 )
#             )
#         )
#         .order_by(Prestamo.fecha.asc(), Prestamo.id.asc())
#         .all()
#     )

#     return prestamos

@router.get("/historial/{deudor_id}/{acreedor_id}", response_model=List[PrestamoResponse])
def historial_deuda(
    deudor_id: int,
    acreedor_id: int,
    db: Session = Depends(get_db)
):

    prestamos = (
        db.query(Prestamo)
        .options(
            joinedload(Prestamo.prestamista),
            joinedload(Prestamo.deudor),
            joinedload(Prestamo.pagos),
        )
        .filter(
            or_(
                and_(
                    Prestamo.deudor_id == deudor_id,
                    Prestamo.prestamista_id == acreedor_id
                ),
                and_(
                    Prestamo.deudor_id == acreedor_id,
                    Prestamo.prestamista_id == deudor_id
                )
            )
        )
        .order_by(Prestamo.fecha.asc(), Prestamo.id.asc())
        .all()
    )

    return prestamos
# =========================
# OBTENER PRESTAMO
# =========================
@router.get("/{prestamo_id}", response_model=PrestamoResponse)
def obtener_prestamo(prestamo_id: int, db: Session = Depends(get_db)):

    prestamo = db.query(Prestamo).get(prestamo_id)

    if not prestamo:
        raise HTTPException(status_code=404, detail="Prestamo no encontrado")

    return prestamo


# =========================
# REGISTRAR PAGO
# =========================
@router.post("/{prestamo_id}/pagos", response_model=PagoPrestamoResponse)
def registrar_pago_prestamo(
    prestamo_id: int,
    data: PagoPrestamoCreate,
    db: Session = Depends(get_db)
):

    prestamo = db.query(Prestamo).get(prestamo_id)

    if not prestamo:
        raise HTTPException(status_code=404, detail="Prestamo no encontrado")

    if prestamo.estado != EstadoPrestamoEnum.ACTIVO:
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
        prestamo.estado = EstadoPrestamoEnum.PAGADO

    db.add(pago)
    db.commit()
    db.refresh(pago)

    return pago


@router.patch("/{prestamo_id}/anular")
def anular_prestamo(prestamo_id: int, db: Session = Depends(get_db)):

    prestamo = db.query(Prestamo).get(prestamo_id)

    if not prestamo:
        raise HTTPException(404, "Prestamo no encontrado")

    if prestamo.estado == EstadoPrestamoEnum.PAGADO:
        raise HTTPException(400, "No se puede anular un prestamo pagado")

    prestamo.estado = EstadoPrestamoEnum.ANULADO

    db.commit()

    return {"message": "Prestamo anulado"}