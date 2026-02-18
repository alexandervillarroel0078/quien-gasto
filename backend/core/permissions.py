# core/permissions.py

# Permisos del sistema (acción → roles permitidos)
PERMISOS = {
    "CREAR_VENTA": {"ADMIN", "VENDEDOR"},
    "CONFIRMAR_VENTA": {"ADMIN"},
    "ANULAR_VENTA": {"ADMIN"},

    # "ANULAR_VENTA": {"ADMIN"},
    "CREAR_COMPRA": {"ADMIN"},
    "ANULAR_COMPRA": {"ADMIN"},

    "CREAR_PRODUCTO": {"ADMIN"},
    "EDITAR_PRODUCTO": {"ADMIN"},
    "ELIMINAR_PRODUCTO": {"ADMIN"},
    # "VER_REPORTES": {"ADMIN", "GERENTE"},
    # "VER_METRICAS": {"ADMIN", "DEV"},
    "CREAR_GASTO": {"ADMIN"},
    "LISTAR_GASTO": {"ADMIN"},
}
