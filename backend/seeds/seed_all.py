#backend\seeds\seed_all.py
from database import SessionLocal

# 👇 SEED PERSONALIZADO (CSV)
from seeds.seed_data import insertar_datos_iniciales
from seeds.seed_periodos import seed_periodos
from seeds.seed_categorias_gasto import seed_categorias_gasto
from seeds.seed_aportes import seed_aportes
from seeds.seed_gastos import seed_gastos

 

def run_seeds():
    db = SessionLocal()
    try:
        # ===============================
        # 1️⃣ SEED BASE (USUARIOS / ROLES)
        # ===============================
        insertar_datos_iniciales(db)
 
        db.commit()

         # ===============================
        # 2️⃣ CATÁLOGOS
        # ===============================
        seed_periodos(db)
        seed_categorias_gasto(db)
        db.commit()

        # ===============================
        # 3️⃣ MOVIMIENTOS
        # ===============================
        seed_aportes(db, 100)
        seed_gastos(db, 120)
        db.commit()
        print("🌱 TODOS los seeds ejecutados correctamente")

    except Exception as e:
        db.rollback()
        print("❌ Error en seeds:", e)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run_seeds()


