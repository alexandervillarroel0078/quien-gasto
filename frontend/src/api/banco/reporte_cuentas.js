// src\api\banco\reporte_cuentas.js  
import api from "../api";

export const getResumenCuentas = (
  anio,
  mes = null,
  cuenta_id = null,
  moneda = null
) =>
  api.get("/reportes/cuentas/resumen", {
    params: {
      ...(anio !== null ? { anio } : {}),
      ...(mes !== null ? { mes } : {}),
      ...(cuenta_id !== null ? { cuenta_id } : {}),
      ...(moneda ? { moneda } : {}),
    },
  });
  
export const getMovimientosPorMes = (
  anio,
  mes = null,
  cuenta_id = null,
  moneda = null
) =>
  api.get("/reportes/cuentas/por-mes", {
    params: {
      anio,
      ...(mes !== null ? { mes } : {}),
      ...(cuenta_id !== null ? { cuenta_id } : {}),
      ...(moneda ? { moneda } : {}),
    },
  });
  
export const getMovimientosPorCategoria = (tipo, moneda = null) =>
  api.get("/reportes/cuentas/por-categoria", {
    params: {
      tipo,
      ...(moneda ? { moneda } : {}),
    },
  });
  
export const getSaldoPorCuenta = (moneda = null) =>
  api.get("/reportes/cuentas/saldo-por-cuenta", {
    params: {
      ...(moneda ? { moneda } : {}),
    },
  });
