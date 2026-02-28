// src\api\banco\movimiento.js
import api from "../api";

export const listarMovimientos = (
  page = 1,
  size = 20,
  q = "",
  cuenta_id = null,
  anio = null,
  mes = null,
  semanaMes = null,
  dia = null
) =>
  api.get("/movimientos/", {
    params: {
      page,
      size,
      ...(q ? { q } : {}),
      ...(cuenta_id ? { cuenta_id } : {}),
      ...(anio ? { anio } : {}),
      ...(mes ? { mes } : {}),
      ...(semanaMes ? { semana_mes: semanaMes } : {}), // 🔥 IMPORTANTE
      ...(dia ? { dia } : {}),
    },
  });


export const obtenerMovimiento = id =>
  api.get(`/movimientos/${id}`);

export const crearMovimiento = data =>
  api.post("/movimientos/", data);

export const editarMovimiento = (id, data) =>
  api.put(`/movimientos/${id}`, data);

export const anularMovimiento = id =>
  api.patch(`/movimientos/${id}/anular`);