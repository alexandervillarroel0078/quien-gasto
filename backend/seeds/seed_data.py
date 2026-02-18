import csv
from pathlib import Path

from models.models import Persona, UsuarioLogin
from core.auth import hash_password


BASE_DIR = Path(__file__).resolve().parent


def insertar_datos_iniciales(db):
    print("🌱 Seed personas y usuarios_login (CSV)")

    # ======================
    # PERSONAS
    # ======================
    personas_path = BASE_DIR / "persona.csv"

    with open(personas_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            existe = db.query(Persona).filter(Persona.id == int(row["id"])).first()
            if existe:
                continue

            persona = Persona(
                id=int(row["id"]),
                nombre=row["nombre"],
                activo=bool(int(row["activo"]))
            )
            db.add(persona)

    db.flush()  # 👈 asegura IDs

    # ======================
    # USUARIOS LOGIN
    # ======================
    usuarios_path = BASE_DIR / "usuarios_login.csv"

    with open(usuarios_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            existe = (
                db.query(UsuarioLogin)
                .filter(UsuarioLogin.correo == row["correo"])
                .first()
            )
            if existe:
                continue

            usuario = UsuarioLogin(
                correo=row["correo"],
                contrasena=hash_password(row["contrasena"]),
                persona_id=int(row["persona_id"])
            )
            db.add(usuario)

    print("✅ Personas y usuarios creados")
