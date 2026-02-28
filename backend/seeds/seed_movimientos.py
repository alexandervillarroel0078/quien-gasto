import random
from faker import Faker
from models.models import Movimiento, Cuenta, CategoriaMovimiento

fake = Faker("es_ES")

def seed_movimientos(db, cantidad=200):

    cuentas = db.query(Cuenta).filter(Cuenta.activo == True).all()
    categorias = db.query(CategoriaMovimiento).filter(CategoriaMovimiento.activo == True).all()

    if not cuentas:
        print("⚠️ No hay cuentas para seed_movimientos")
        return

    for _ in range(cantidad):
        cuenta = random.choice(cuentas)

        tipo = random.choice(["INGRESO", "EGRESO"])

        # filtrar categoría por tipo
        categorias_filtradas = [c for c in categorias if c.tipo == tipo]
        categoria = random.choice(categorias_filtradas) if categorias_filtradas else None

        db.add(
            Movimiento(
                cuenta_id=cuenta.id,
                tipo=tipo,
                monto=round(random.uniform(50, 3000), 2),
                concepto=fake.sentence(nb_words=4),
                fecha=fake.date_between(start_date="-6M", end_date="today"),
                categoria_id=categoria.id if categoria else None,
                estado="ACTIVO",
            )
        )

    db.commit()
    print(f"✅ {cantidad} movimientos creados")