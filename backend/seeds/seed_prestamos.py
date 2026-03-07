# backend/seeds/seed_prestamos.py
"""
Seed de préstamos y pagos. Compatible con las rutas en routes/prestamos.py.
- Crea datos de ejemplo fijos (README: ISIDORO→ALEXANDER, MARIA→ALEXANDER, ELVIS→MARIA).
- Opcionalmente agrega préstamos aleatorios.
Requiere: Personas y al menos un UsuarioLogin (seed_data).
"""
import random
from datetime import date, timedelta
from decimal import Decimal

from models.models import Prestamo, PagoPrestamo, Persona, UsuarioLogin

try:
    from faker import Faker
    fake = Faker("es_ES")
except ImportError:
    fake = None


def _get_usuario_id(db):
    """Usuario para registrar pagos; las rutas usan 1 por defecto."""
    u = db.query(UsuarioLogin).first()
    return u.id if u else 1


def _personas_por_nombre(db):
    """Devuelve dict nombre_upper -> id para armar ejemplos por nombre."""
    return {p.nombre.upper(): p.id for p in db.query(Persona).all()}


def seed_prestamos_ejemplo_readme(db, usuario_id):
    """
    Crea los 3 casos del README:
    - ISIDORO debe a ALEXANDER: Bs 2023 prestado, pagos 1000+796, saldo 227.
    - MARIA debe a ALEXANDER: Bs 630 saldo.
    - ELVIS debe a MARIA: Bs 2842 saldo.
    """
    ids = _personas_por_nombre(db)
    alexander = ids.get("ALEXANDER")
    maria = ids.get("MARIA")
    isidoro = ids.get("ISIDORO")
    elvis = ids.get("ELVIS")

    if not all([alexander, maria, isidoro, elvis]):
        return 0

    # ----- ISIDORO → ALEXANDER: 2023 prestado, pagos 1000 y 796, saldo 227 -----
    p1 = Prestamo(
        prestamista_id=alexander,
        deudor_id=isidoro,
        monto=Decimal("2023.00"),
        saldo_pendiente=Decimal("227.00"),
        fecha=date(2026, 3, 5),
        concepto="Préstamo ejemplo",
        estado="ACTIVO",
    )
    db.add(p1)
    db.flush()

    db.add(PagoPrestamo(
        prestamo_id=p1.id,
        monto=Decimal("1000.00"),
        fecha=date(2026, 3, 10),
        usuario_login_id=usuario_id,
    ))
    db.add(PagoPrestamo(
        prestamo_id=p1.id,
        monto=Decimal("796.00"),
        fecha=date(2026, 3, 15),
        usuario_login_id=usuario_id,
    ))

    # ----- MARIA → ALEXANDER: saldo 630 -----
    p2 = Prestamo(
        prestamista_id=alexander,
        deudor_id=maria,
        monto=Decimal("630.00"),
        saldo_pendiente=Decimal("630.00"),
        fecha=date(2026, 2, 1),
        concepto="Préstamo ejemplo",
        estado="ACTIVO",
    )
    db.add(p2)

    # ----- ELVIS → MARIA: saldo 2842 -----
    p3 = Prestamo(
        prestamista_id=maria,
        deudor_id=elvis,
        monto=Decimal("2842.00"),
        saldo_pendiente=Decimal("2842.00"),
        fecha=date(2026, 1, 15),
        concepto="Préstamo ejemplo",
        estado="ACTIVO",
    )
    db.add(p3)

    return 3


def seed_prestamos_aleatorios(db, cantidad, usuario_id):
    """Préstamos aleatorios entre personas; algunos con pagos parciales."""
    personas = db.query(Persona).all()
    if len(personas) < 2:
        return 0

    for _ in range(cantidad):
        prestamista, deudor = random.sample(personas, 2)
        monto = round(Decimal(str(random.uniform(100, 3000))), 2)

        prestamo = Prestamo(
            prestamista_id=prestamista.id,
            deudor_id=deudor.id,
            monto=monto,
            saldo_pendiente=monto,
            fecha=fake.date_between(start_date="-1y", end_date="today") if fake else date.today(),
            concepto=random.choice([
                "prestamo emergencia",
                "prestamo moto",
                "prestamo comida",
                "prestamo familiar",
                "prestamo negocio",
            ]),
            estado="ACTIVO",
        )
        db.add(prestamo)
        db.flush()

        if random.random() > 0.5 and fake:
            n_pagos = random.randint(1, 3)
            for _ in range(n_pagos):
                if prestamo.saldo_pendiente <= 0:
                    break
                pago_monto = round(
                    Decimal(str(random.uniform(50, float(prestamo.saldo_pendiente)))),
                    2,
                )
                pago = PagoPrestamo(
                    prestamo_id=prestamo.id,
                    monto=pago_monto,
                    fecha=fake.date_between(
                        start_date=prestamo.fecha,
                        end_date="today",
                    ),
                    usuario_login_id=usuario_id,
                )
                prestamo.saldo_pendiente -= pago_monto
                db.add(pago)

            if prestamo.saldo_pendiente <= 0:
                prestamo.estado = "PAGADO"

    return cantidad


def seed_prestamos(db, cantidad_aleatorios=50):
    """
    Ejecuta el seed de préstamos.
    - Siempre intenta crear los 3 ejemplos del README (si existen ALEXANDER, MARIA, ISIDORO, ELVIS).
    - Luego crea cantidad_aleatorios préstamos aleatorios.
    """
    personas = db.query(Persona).all()
    if len(personas) < 2:
        print("⚠ seed_prestamos: se necesitan al menos 2 personas. Ejecuta antes seed_data.")
        return

    usuario_id = _get_usuario_id(db)

    n_ejemplo = seed_prestamos_ejemplo_readme(db, usuario_id)
    if n_ejemplo:
        print(f"  ✅ {n_ejemplo} préstamos de ejemplo (README)")

    n_rand = seed_prestamos_aleatorios(db, cantidad_aleatorios, usuario_id)
    print(f"✅ Préstamos: {n_ejemplo} ejemplo + {n_rand} aleatorios")
