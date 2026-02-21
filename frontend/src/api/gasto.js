// frontend/src/api/gasto.js
import api from "./api";

export const listarGastos = (page = 1, size = 20, q = "", periodo_id = null) =>
  api.get("/gastos/", { params: { page, size, q, periodo_id } });

export const obtenerGasto = (id) =>
  api.get(`/gastos/${id}`);

export const crearGasto = (data) =>
  api.post("/gastos/", data);

export const actualizarGasto = (id, data) =>
  api.put(`/gastos/${id}`, data);

export const anularGasto = (id) =>
  api.patch(`/gastos/${id}/anular`);
