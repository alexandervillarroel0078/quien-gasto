//  frontend/src/api/aporte.js
import api from "./api";

// =======================
// LISTAR
// =======================
// export const listarAportes = (page = 1, size = 20, q = "", periodo_id = null) =>
//   api.get("/aportes", { params: { page, size, q, periodo_id } });

export const listarAportes = (
  page = 1,
  size = 20,
  q = "",
  periodo_id = null,
  persona_id = null
) =>
  api.get("/aportes", {
    params: {
      page,
      size,
      ...(q ? { q } : {}),
      ...(periodo_id ? { periodo_id } : {}),
      ...(persona_id ? { persona_id } : {}),
    },
  });

// =======================
// CREAR
// =======================
export const crearAporte = (data) =>
  api.post("/aportes", data);

// =======================
// ACTUALIZAR ✅ NUEVO
// =======================
export const actualizarAporte = (id, data) =>
  api.put(`/aportes/${id}`, data);

// =======================
// ANULAR
// =======================
export const anularAporte = (id) =>
  api.patch(`/aportes/${id}/anular`);
