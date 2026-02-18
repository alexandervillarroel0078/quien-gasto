# backend/core/router.py
from fastapi import FastAPI



from routes.usuarios import usuarios
from routes import auth
from routes import personas
from routes import periodos
from routes import aportes
from routes import gastos
from routes import bitacora
 


def include_routers(app: FastAPI):
    app.include_router(auth.router)
    app.include_router(usuarios.router)
    app.include_router(personas.router)
    app.include_router(periodos.router)
    app.include_router(aportes.router)
    app.include_router(gastos.router)
    app.include_router(bitacora.router)

 