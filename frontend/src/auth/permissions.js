// frontend/src/auth/permissions.js
export const PERMISOS = {
    CREAR_VENTA: ["ADMIN", "VENDEDOR"],
    CONFIRMAR_VENTA: ["ADMIN"],
    ANULAR_VENTA: ["ADMIN"],

    CREAR_COMPRA: ["ADMIN"],
    ANULAR_COMPRA: ["ADMIN"],

    CREAR_PRODUCTO: ["ADMIN"],
    EDITAR_PRODUCTO: ["ADMIN"],
    ELIMINAR_PRODUCTO: ["ADMIN"],
};

export function can(user, permiso) {
    if (!user) return false;
    return PERMISOS[permiso]?.includes(user.rol);
}
