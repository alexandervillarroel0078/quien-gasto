#backend\routes\banco\reporte_cuentas.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from database import get_db
from models.models import Movimiento, Cuenta, CategoriaMovimiento

router = APIRouter(
    prefix="/reportes/cuentas",
    tags=["Reportes Cuentas"]
)

@router.get("/resumen")
def resumen_cuentas(
    anio: int | None = Query(None),
    mes: int | None = Query(None),
    cuenta_id: int | None = Query(None),
    moneda: str | None = Query(None),  # 👈 NUEVO
    db: Session = Depends(get_db)
):

    query = db.query(Movimiento).join(Cuenta)

    if anio:
        query = query.filter(extract("year", Movimiento.fecha) == anio)

    if mes:
        query = query.filter(extract("month", Movimiento.fecha) == mes)

    if cuenta_id:
        query = query.filter(Movimiento.cuenta_id == cuenta_id)

    if moneda:
        query = query.filter(Cuenta.moneda == moneda)

    ingresos = query.filter(Movimiento.tipo == "INGRESO") \
        .with_entities(func.coalesce(func.sum(Movimiento.monto), 0)) \
        .scalar()

    egresos = query.filter(Movimiento.tipo == "EGRESO") \
        .with_entities(func.coalesce(func.sum(Movimiento.monto), 0)) \
        .scalar()

    return {
        "moneda": moneda,
        "ingresos": float(ingresos),
        "egresos": float(egresos),
        "saldo": float(ingresos - egresos),
    }


# =====================================================
# 2️⃣ INGRESOS VS EGRESOS POR MES (GRAFICA LINEAL)
# =====================================================
@router.get("/por-mes")
def movimientos_por_mes(
    anio: int = Query(...),
    mes: int | None = Query(None),
    cuenta_id: int | None = Query(None),
    tipo: str | None = Query(None),
    moneda: str | None = Query(None),  # 👈 NUEVO
    db: Session = Depends(get_db)
):

    query = db.query(
        extract("month", Movimiento.fecha).label("mes"),
        Movimiento.tipo,
        func.sum(Movimiento.monto).label("total")
    ).join(Cuenta).filter(
        extract("year", Movimiento.fecha) == anio
    )

    if mes and 1 <= mes <= 12:
        query = query.filter(extract("month", Movimiento.fecha) == mes)

    if cuenta_id:
        query = query.filter(Movimiento.cuenta_id == cuenta_id)

    if tipo in ["INGRESO", "EGRESO"]:
        query = query.filter(Movimiento.tipo == tipo)

    if moneda:
        query = query.filter(Cuenta.moneda == moneda)

    resultados = query.group_by(
        "mes",
        Movimiento.tipo
    ).all()

    data = {}

    for r in resultados:
        m = int(r.mes)
        if m not in data:
            data[m] = {"mes": m, "INGRESO": 0, "EGRESO": 0}
        data[m][r.tipo] = float(r.total)

    return sorted(data.values(), key=lambda x: x["mes"])
# =====================================================
# 3️⃣ DISTRIBUCION POR CATEGORIA (GRAFICA PIE)
# =====================================================
@router.get("/por-categoria")
def movimientos_por_categoria(
    tipo: str = Query(...),
    moneda: str | None = Query(None),  # 👈 NUEVO
    db: Session = Depends(get_db)
):

    query = db.query(
        CategoriaMovimiento.nombre,
        func.sum(Movimiento.monto).label("total")
    ).join(
        Movimiento,
        Movimiento.categoria_id == CategoriaMovimiento.id
    ).join(
        Cuenta,
        Movimiento.cuenta_id == Cuenta.id
    ).filter(
        Movimiento.tipo == tipo
    )

    if moneda:
        query = query.filter(Cuenta.moneda == moneda)

    resultados = query.group_by(
        CategoriaMovimiento.nombre
    ).all()

    return [
        {
            "categoria": r.nombre,
            "total": float(r.total)
        }
        for r in resultados
    ]

@router.get("/saldo-por-cuenta")
def saldo_por_cuenta(
    moneda: str | None = Query(None),
    db: Session = Depends(get_db)
):

    query = db.query(
        Cuenta.id,
        Cuenta.nombre,
        Cuenta.moneda,
        Cuenta.saldo_inicial,
        Movimiento.tipo,
        func.coalesce(func.sum(Movimiento.monto), 0).label("total")
    ).outerjoin(
        Movimiento,
        Movimiento.cuenta_id == Cuenta.id
    )

    if moneda:
        query = query.filter(Cuenta.moneda == moneda)

    resultados = query.group_by(
        Cuenta.id,
        Cuenta.nombre,
        Cuenta.moneda,
        Cuenta.saldo_inicial,
        Movimiento.tipo
    ).all()

    data_dict = {}

    for r in resultados:
        key = f"{r.id}-{r.moneda}"

        if key not in data_dict:
            data_dict[key] = {
                "cuenta": r.nombre,
                "moneda": r.moneda,
                "saldo_inicial": float(r.saldo_inicial or 0),
                "INGRESO": 0,
                "EGRESO": 0,
            }

        if r.tipo:
            data_dict[key][r.tipo] = float(r.total)

    data = []

    for cuenta in data_dict.values():
        saldo_final = (
            cuenta["saldo_inicial"]
            + cuenta["INGRESO"]
            - cuenta["EGRESO"]
        )

        data.append({
            "cuenta": cuenta["cuenta"],
            "moneda": cuenta["moneda"],
            "saldo": saldo_final
        })

    return data


