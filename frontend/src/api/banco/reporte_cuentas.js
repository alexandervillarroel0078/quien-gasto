// src\api\banco\reporte_cuentas.js 
// src/api/banco/reporte_cuentas.js
import api from "../api";

// ===============================
// RESUMEN GENERAL
// ===============================
export const getResumenCuentas = (anio, mes = null, cuenta_id = null) =>
  api.get("/reportes/cuentas/resumen", {
    params: {
      ...(anio ? { anio } : {}),
      ...(mes ? { mes } : {}),
      ...(cuenta_id ? { cuenta_id } : {}),
    },
  });
// ===============================
// INGRESOS VS EGRESOS POR MES
// ===============================
export const getMovimientosPorMes = (anio, mes = null, cuenta_id = null) =>
  api.get("/reportes/cuentas/por-mes", {
    params: {
      anio,
      ...(mes ? { mes } : {}),
      ...(cuenta_id ? { cuenta_id } : {}),
    },
  });

// ===============================
// DISTRIBUCIÓN POR CATEGORIA
// ===============================
export const getMovimientosPorCategoria = (tipo) =>
  api.get("/reportes/cuentas/por-categoria", {
    params: { tipo },
  });

// ===============================
// SALDO POR CUENTA
// ===============================
export const getSaldoPorCuenta = () =>
  api.get("/reportes/cuentas/saldo-por-cuenta");