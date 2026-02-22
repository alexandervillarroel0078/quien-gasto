from models.models import CategoriaGasto

def seed_categorias_gasto(db):
    categorias = [
        "Alquiler",
        "Servicios",
        "Transporte",
        "Papelería",
        "Mantenimiento",
        "Otros"
    ]

    for nombre in categorias:
        existe = db.query(CategoriaGasto).filter_by(nombre=nombre).first()
        if existe:
            continue

        db.add(
            CategoriaGasto(
                nombre=nombre,
                activo=True
            )
        )