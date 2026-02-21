# schemas/reportes.py
from pydantic import BaseModel
from datetime import date
from decimal import Decimal
from typing import Optional


class BalanceResponse(BaseModel):
    total_aportes: float
    total_gastos: float
    balance: float
    periodo_id: Optional[int] = None
    periodo_nombre: Optional[str] = None


class ReporteAportesItem(BaseModel):
    periodo_id: Optional[int]
    periodo_nombre: Optional[str]
    persona_id: int
    persona_nombre: str
    total: float
    cantidad: int


class ReporteGastosItem(BaseModel):
    periodo_id: Optional[int]
    periodo_nombre: Optional[str]
    persona_id: int
    persona_nombre: str
    total: float
    cantidad: int


class ReportePersonaItem(BaseModel):
    persona_id: int
    nombre: str
    total_aportes: float
    total_gastos: float
    balance: float


class ReporteGastoCategoriaItem(BaseModel):
    categoria_id: Optional[int]
    categoria_nombre: Optional[str]
    total: float
    cantidad: int


class PeriodoCompararItem(BaseModel):
    periodo_id: int
    periodo_nombre: str
    total_aportes: float
    total_gastos: float
    balance: float
