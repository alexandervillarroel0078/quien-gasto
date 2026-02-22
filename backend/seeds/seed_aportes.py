import random
from faker import Faker
from models.models import Aporte, UsuarioLogin, Periodo

fake = Faker("es_ES")

def seed_aportes(db, cantidad=100):
    # solo usuarios con persona asociada
    usuarios = db.query(UsuarioLogin).filter(
        UsuarioLogin.persona_id.isnot(None)
    ).all()

    periodos = db.query(Periodo).all()

    if not usuarios:
        print("⚠️ No hay usuarios con persona para seed_aportes")
        return

    for _ in range(cantidad):
        usuario = random.choice(usuarios)
        persona_id = usuario.persona_id
        periodo = random.choice(periodos) if periodos else None

        db.add(
            Aporte(
                persona_id=persona_id,
                usuario_login_id=usuario.id,
                periodo_id=periodo.id if periodo else None,
                monto=round(random.uniform(50, 1000), 2),
                fecha=fake.date_between(start_date="-6M", end_date="today"),
                nota=fake.sentence(nb_words=6),
                estado="ACTIVO"
            )
        )