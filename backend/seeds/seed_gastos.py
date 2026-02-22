import random
from faker import Faker
from models.models import (
    Gasto,
    UsuarioLogin,
    Periodo,
    CategoriaGasto
)

fake = Faker("es_ES")

def seed_gastos(db, cantidad=120):
    # solo usuarios con persona asociada
    usuarios = db.query(UsuarioLogin).filter(
        UsuarioLogin.persona_id.isnot(None)
    ).all()

    periodos = db.query(Periodo).all()
    categorias = db.query(CategoriaGasto).all()

    if not usuarios:
        print("⚠️ No hay usuarios con persona para seed_gastos")
        return

    for _ in range(cantidad):
        usuario = random.choice(usuarios)
        persona_id = usuario.persona_id
        periodo = random.choice(periodos) if periodos else None
        categoria = random.choice(categorias) if categorias else None

        # fecha coherente con el periodo
        fecha = (
            fake.date_between(
                start_date=periodo.fecha_inicio,
                end_date=periodo.fecha_fin
            )
            if periodo
            else fake.date_between(start_date="-6M", end_date="today")
        )

        db.add(
            Gasto(
                concepto=fake.sentence(nb_words=4),
                monto=round(random.uniform(20, 800), 2),
                fecha=fecha,
                persona_id=persona_id,
                usuario_login_id=usuario.id,
                periodo_id=periodo.id if periodo else None,
                categoria_id=categoria.id if categoria else None,
                estado="ACTIVO"
            )
        )