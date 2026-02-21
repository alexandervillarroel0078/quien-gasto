# app/models/__init__.py
from .models import Aporte, Gasto, Persona, Periodo, CategoriaGasto
from .events import *

for model in [Aporte, Gasto, Persona, Periodo]:
    event.listen(model, "after_insert", after_insert)
    event.listen(model, "after_update", after_update)

