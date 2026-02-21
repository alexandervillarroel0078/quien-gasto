# backend/models/models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    Enum
)
from sqlalchemy import  event

from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import CheckConstraint
from database import Base

EstadoMovimientoEnum = Enum(
    "ACTIVO",
    "ANULADO",
    name="estado_movimiento"
)

AccionBitacoraEnum = Enum(
    "CREATE",
    "UPDATE",
    "ANULAR",
    "CERRAR",
    "REABRIR",
    name="accion_bitacora"
)

class Bitacora(Base):
    __tablename__ = "bitacora"

    id = Column(Integer, primary_key=True, index=True)

    entidad = Column(String(50), nullable=False)
    entidad_id = Column(Integer, nullable=False)

    accion = Column(AccionBitacoraEnum, nullable=False)
    # CREATE, UPDATE, DELETE

    descripcion = Column(String(300), nullable=True)

    usuario_id = Column(Integer, ForeignKey("usuarios_login.id"), nullable=True)
    fecha = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("UsuarioLogin")


class UsuarioLogin(Base):
    __tablename__ = "usuarios_login"

    id = Column(Integer, primary_key=True, index=True)
    correo = Column(String(100), unique=True, nullable=False)
    contrasena = Column(String(200), nullable=False)

    # Relación uno a uno con el perfil
    persona_id = Column(Integer, ForeignKey("personas.id"), nullable=True)
    persona = relationship("Persona")

class Persona(Base):
    __tablename__ = "personas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    activo = Column(Boolean, default=True)

    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    aportes = relationship("Aporte", back_populates="persona")
    gastos = relationship("Gasto", back_populates="persona")


class Aporte(Base):
    __tablename__ = "aportes"

    id = Column(Integer, primary_key=True, index=True)

    persona_id = Column(Integer, ForeignKey("personas.id"), nullable=False)
    usuario_login_id = Column(Integer, ForeignKey("usuarios_login.id"), nullable=False)
    periodo_id = Column(Integer, ForeignKey("periodos.id"), nullable=True)

    monto = Column(Numeric(12, 2), nullable=False)
    fecha = Column(Date, nullable=False)
    nota = Column(String(200), nullable=True)

    estado = Column(EstadoMovimientoEnum, default="ACTIVO", nullable=False)

    persona = relationship("Persona", back_populates="aportes")
    usuario = relationship("UsuarioLogin")
    periodo = relationship("Periodo", back_populates="aportes")
    __table_args__ = (
        CheckConstraint("monto > 0", name="ck_aporte_monto_positivo"),
    )

class CategoriaGasto(Base):
    __tablename__ = "categorias_gasto"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), unique=True, nullable=False)
    activo = Column(Boolean, default=True)

    gastos = relationship("Gasto", back_populates="categoria")

class Gasto(Base):
    __tablename__ = "gastos"

    id = Column(Integer, primary_key=True, index=True)

    concepto = Column(String(200), nullable=False)
    monto = Column(Numeric(12, 2), nullable=False)
    fecha = Column(Date, nullable=False)

    persona_id = Column(Integer, ForeignKey("personas.id"), nullable=False)
    usuario_login_id = Column(Integer, ForeignKey("usuarios_login.id"), nullable=False)
    periodo_id = Column(Integer, ForeignKey("periodos.id"), nullable=True)

    categoria_id = Column(Integer, ForeignKey("categorias_gasto.id"), nullable=True)

    estado = Column(EstadoMovimientoEnum, default="ACTIVO", nullable=False)

    persona = relationship("Persona", back_populates="gastos")
    usuario = relationship("UsuarioLogin")
    periodo = relationship("Periodo", back_populates="gastos")

    categoria = relationship("CategoriaGasto", back_populates="gastos")

    __table_args__ = (
        CheckConstraint("monto > 0", name="ck_gasto_monto_positivo"),
    )

class Periodo(Base):
    __tablename__ = "periodos"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String(50), nullable=False)  # Ej: "Febrero 2026"
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)

    cerrado = Column(Boolean, default=False)

    aportes = relationship("Aporte", back_populates="periodo")
    gastos = relationship("Gasto", back_populates="periodo")

    __table_args__ = (
        CheckConstraint(
            "fecha_inicio <= fecha_fin",
            name="ck_periodo_fechas_validas"
        ),
    )