from database import SessionLocal

# 👇 SEED PERSONALIZADO (CSV)
from seeds.seed_data import insertar_datos_iniciales

 

def run_seeds():
    db = SessionLocal()
    try:
        # ===============================
        # 1️⃣ SEED BASE (USUARIOS / ROLES)
        # ===============================
        insertar_datos_iniciales(db)
 
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


