// frontend/src/api/persona.js
import api from "./api";

export const listarPersonas = (page = 1, size = 20, q = "") =>
  api.get("/personas/", { params: { page, size, q } });

export const obtenerPersona = id =>
  api.get(`/personas/${id}`);

export const crearPersona = data =>
  api.post("/personas/", data);

export const editarPersona = (id, data) =>
  api.put(`/personas/${id}`, data);

export const desactivarPersona = id =>
  api.delete(`/personas/${id}`);

export const activarPersona = id =>
  api.post(`/personas/${id}/activar`);
