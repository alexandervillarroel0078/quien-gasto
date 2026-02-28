import random
from faker import Faker
from models.models import CategoriaMovimiento

fake = Faker("es_ES")

def seed_categorias_movimiento(db, cantidad=20):

    tipos = ["INGRESO", "EGRESO"]

    for _ in range(cantidad):
        db.add(
            CategoriaMovimiento(
                nombre=fake.word().capitalize(),
                tipo=random.choice(tipos),
                activo=True
            )
        )

    db.commit()
    print(f"✅ {cantidad} categorías de movimiento creadas")