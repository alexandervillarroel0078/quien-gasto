# backend/core/router.py
from fastapi import FastAPI



from routes.usuarios import usuarios
from routes import auth
from routes import personas
from routes import categorias_gasto
from routes import periodos
from routes import aportes
from routes import gastos
from routes import bitacora
from routes import resumen
from routes import reportes

from routes.banco import cuentas
from routes.banco import categorias_movimiento
from routes.banco import movimientos
from routes.banco import reporte_cuentas

def include_routers(app: FastAPI):
    app.include_router(auth.router)
    app.include_router(usuarios.router)
    app.include_router(personas.router)
    app.include_router(categorias_gasto.router)
    app.include_router(periodos.router)
    app.include_router(aportes.router)
    app.include_router(gastos.router)
    app.include_router(bitacora.router)
    app.include_router(resumen.router)
    app.include_router(reportes.router)

    app.include_router(cuentas.router)
    app.include_router(categorias_movimiento.router)
    app.include_router(movimientos.router)
    app.include_router(reporte_cuentas.router)

 