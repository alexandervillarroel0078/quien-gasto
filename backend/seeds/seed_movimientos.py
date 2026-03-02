import random
from faker import Faker
from models.models import (
    Movimiento,
    Cuenta,
    CategoriaMovimiento,
    UsuarioLogin,
    Persona,
    Periodo,
)

fake = Faker("es_ES")

def seed_movimientos(db, cantidad=200):

    cuentas = db.query(Cuenta).filter(Cuenta.activo == True).all()
    categorias = db.query(CategoriaMovimiento).filter(CategoriaMovimiento.activo == True).all()
    usuarios = db.query(UsuarioLogin).all()
    personas = db.query(Persona).filter(Persona.activo == True).all()
    periodos = db.query(Periodo).all()

    if not cuentas:
        print("⚠️ No hay cuentas")
        return

    if not usuarios:
        print("⚠️ No hay usuarios")
        return

    if not periodos:
        print("⚠️ No hay periodos")
        return

    for _ in range(cantidad):

        cuenta = random.choice(cuentas)
        usuario = random.choice(usuarios)

        tipo = random.choice(["INGRESO", "EGRESO"])

        # filtrar categoría por tipo
        categorias_filtradas = [c for c in categorias if c.tipo == tipo]
        categoria = random.choice(categorias_filtradas) if categorias_filtradas else None

        # fecha dentro de un periodo real
        periodo = random.choice(periodos)
        fecha = fake.date_between(
            start_date=periodo.fecha_inicio,
            end_date=periodo.fecha_fin
        )

        # persona opcional (50% probabilidad)
        persona = random.choice(personas) if personas and random.random() > 0.5 else None

        movimiento = Movimiento(
            cuenta_id=cuenta.id,
            tipo=tipo,
            monto=round(random.uniform(50, 3000), 2),
            concepto=fake.sentence(nb_words=4),
            fecha=fecha,
            categoria_id=categoria.id if categoria else None,
            persona_id=persona.id if persona else None,
            usuario_login_id=usuario.id,
            periodo_id=periodo.id,
            estado="ACTIVO",
        )

        db.add(movimiento)

    db.commit()
    print(f"✅ {cantidad} movimientos creados correctamente")