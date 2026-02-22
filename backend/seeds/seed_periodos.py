# from datetime import date
# from models.models import Periodo

# def seed_periodos(db):
#     periodos = [
#         ("Enero 2026", date(2026, 1, 1), date(2026, 1, 31)),
#         ("Febrero 2026", date(2026, 2, 1), date(2026, 2, 28)),
#         ("Marzo 2026", date(2026, 3, 1), date(2026, 3, 31)),
#     ]

#     for nombre, inicio, fin in periodos:
#         existe = db.query(Periodo).filter(Periodo.nombre == nombre).first()
#         if existe:
#             continue

#         db.add(
#             Periodo(
#                 nombre=nombre,
#                 fecha_inicio=inicio,
#                 fecha_fin=fin,
#                 cerrado=False
#             )
#         )
from datetime import date
import calendar
from models.models import Periodo

MESES_ES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

def seed_periodos(db, years=2):
    hoy = date.today()

    inicio = date(hoy.year - (years - 1), 1, 1)
    fin = date(hoy.year, 12, 1)

    actual = inicio

    while actual <= fin:
        year = actual.year
        month = actual.month

        nombre = f"{MESES_ES[month - 1]} {year}"
        ultimo_dia = calendar.monthrange(year, month)[1]
        fecha_fin = date(year, month, ultimo_dia)

        existe = db.query(Periodo).filter(
            Periodo.nombre == nombre
        ).first()

        if not existe:
            db.add(
                Periodo(
                    nombre=nombre,
                    fecha_inicio=actual,
                    fecha_fin=fecha_fin,
                    cerrado=False
                )
            )

        # avanzar al siguiente mes
        if month == 12:
            actual = date(year + 1, 1, 1)
        else:
            actual = date(year, month + 1, 1)