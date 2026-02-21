# app/models/events.py
from sqlalchemy import event
from datetime import datetime
from .models import Bitacora

def registrar_bitacora(mapper, connection, target, accion):
    connection.execute(
        Bitacora.__table__.insert().values(
            entidad=target.__tablename__,
            entidad_id=target.id,
            accion=accion,
            descripcion=f"{accion} en {target.__tablename__}",
            fecha=datetime.utcnow()
        )
    )

def after_insert(mapper, connection, target):
    registrar_bitacora(mapper, connection, target, "CREATE")

def after_update(mapper, connection, target):
    registrar_bitacora(mapper, connection, target, "UPDATE")
