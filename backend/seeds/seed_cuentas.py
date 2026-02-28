import random
from faker import Faker
from models.models import Cuenta, TipoCuentaEnum

fake = Faker("es_ES")

def seed_cuentas(db, cantidad=15):

    tipos = ["BANCO", "CAJA", "AHORRO"]

    for _ in range(cantidad):
        tipo = random.choice(tipos)

        db.add(
            Cuenta(
                nombre=f"{tipo} {fake.company()}",
                numero_cuenta=fake.bban() if tipo == "BANCO" else None,
                banco=fake.company() if tipo == "BANCO" else None,
                tipo=tipo,
                moneda=random.choice(["BOB", "USD"]),
                saldo_inicial=round(random.uniform(500, 15000), 2),
                activo=True,
            )
        )

    db.commit()
    print(f"✅ {cantidad} cuentas creadas")