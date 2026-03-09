// frontend/src/api/prestamo.js
import api from "./api";


// ===============================
// CREAR PRESTAMO
// ===============================
export const crearPrestamo = (data) =>
  api.post("/prestamos/", data);


// ===============================
// REGISTRAR PAGO
// ===============================
export const registrarPagoPrestamo = (prestamo_id, data) =>
  api.post(`/prestamos/${prestamo_id}/pagos`, data);

// ===============================
// ANULAR PRESTAMO
// ===============================
export const anularPrestamo = (prestamo_id) =>
  api.patch(`/prestamos/${prestamo_id}/anular`);


// ===============================
// RESUMEN DE DEUDAS
// ===============================
// export const resumenDeudas = () =>
//   api.get("/prestamos/resumen");

export const resumenDeudas = (persona_id = null, estado = null) =>
  api.get("/prestamos/resumen", {
    params: {
      ...(persona_id ? { persona_id } : {}),
      ...(estado ? { estado } : {}),
    },
  });

// ===============================
// HISTORIAL DE DEUDA
// ===============================
export const historialDeuda = (deudor_id, acreedor_id) =>
  api.get(`/prestamos/historial/${deudor_id}/${acreedor_id}`);

 








