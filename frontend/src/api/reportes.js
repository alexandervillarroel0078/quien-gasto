// frontend/src/api/reportes.js
import api from "./api";

export const reporteBalance = (periodo_id = null) =>
  api.get("/reportes/balance", { params: periodo_id != null ? { periodo_id } : {} });

export const reporteAportes = (periodo_id = null) =>
  api.get("/reportes/aportes", { params: periodo_id != null ? { periodo_id } : {} });

export const reporteGastos = (periodo_id = null) =>
  api.get("/reportes/gastos", { params: periodo_id != null ? { periodo_id } : {} });

export const reportePeriodoBalance = (id) =>
  api.get(`/reportes/periodos/${id}/balance`);

export const reportePersonas = (periodo_id = null) =>
  api.get("/reportes/personas", { params: periodo_id != null ? { periodo_id } : {} });

export const reporteGastosCategorias = (periodo_id = null) =>
  api.get("/reportes/gastos/categorias", { params: periodo_id != null ? { periodo_id } : {} });

export const reportePeriodosComparar = (ids) =>
  api.get("/reportes/periodos/comparar", { params: { ids: ids.join(",") } });
