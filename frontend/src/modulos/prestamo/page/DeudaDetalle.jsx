// src/modulos/prestamo/page/DeudaDetalle.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../layouts/Layout";
import {
    historialDeuda,
    registrarPagoPrestamo
} from "../../../api/prestamo";

function formatFecha(str) {
    if (!str) return "";
    const d = new Date(str);
    return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DeudaDetalle() {
    const { deudor_id, acreedor_id } = useParams();
    const [prestamos, setPrestamos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [pagoModal, setPagoModal] = useState(null); // { prestamo } o null
    const [pagoMonto, setPagoMonto] = useState("");
    const [pagoFecha, setPagoFecha] = useState(new Date().toISOString().slice(0, 10));
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        cargar();
    }, [deudor_id, acreedor_id]);

    const cargar = async () => {
        setCargando(true);
        try {
            const res = await historialDeuda(deudor_id, acreedor_id);
            setPrestamos(Array.isArray(res?.data) ? res.data : []);
        } catch (_) {
            setPrestamos([]);
        } finally {
            setCargando(false);
        }
    };

    const totalPrestado = prestamos.reduce((a, p) => a + Number(p.monto), 0);
    const totalSaldo = prestamos.reduce((a, p) => a + Number(p.saldo_pendiente), 0);
    const totalPagado = totalPrestado - totalSaldo;

    // Historial unificado: préstamos y pagos ordenados por fecha
    const historial = [];
    prestamos.forEach((p) => {
        historial.push({ tipo: "prestamo", fecha: p.fecha, monto: Number(p.monto), id: `p-${p.id}` });
        (p.pagos || []).forEach((pg) => {
            historial.push({
                tipo: "pago",
                fecha: pg.fecha,
                monto: -Number(pg.monto),
                id: `g-${pg.id}`,
            });
        });
    });
    historial.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const prestamosActivos = prestamos.filter(
        (p) => p.estado === "ACTIVO" && Number(p.saldo_pendiente) > 0
    );

    const handleAbrirPagar = (prestamo) => {
        setPagoModal(prestamo);
        setPagoMonto("");
        setPagoFecha(new Date().toISOString().slice(0, 10));
    };

    const handleRegistrarPago = async (e) => {
        e.preventDefault();
        if (!pagoModal || !pagoMonto || Number(pagoMonto) <= 0) return;
        const monto = Number(pagoMonto);
        if (monto > Number(pagoModal.saldo_pendiente)) {
            alert("El monto no puede ser mayor al saldo pendiente.");
            return;
        }
        setEnviando(true);
        try {
            await registrarPagoPrestamo(pagoModal.id, { monto, fecha: pagoFecha });
            setPagoModal(null);
            cargar();
        } catch (err) {
            alert(err.response?.data?.detail || "Error al registrar el pago.");
        } finally {
            setEnviando(false);
        }
    };

    const nombreDeudor = prestamos[0]?.deudor?.nombre ?? "Deudor";
    const nombreAcreedor = prestamos[0]?.prestamista?.nombre ?? "Acreedor";

    return (
        <Layout>
            <h2>📜 Deuda: {nombreDeudor} → {nombreAcreedor}</h2>

            {cargando ? (
                <p>Cargando...</p>
            ) : (
                <>
                    <div style={{ marginBottom: 24, padding: 16, background: "#f9fafb", borderRadius: 8 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>
                            {nombreDeudor} → {nombreAcreedor}
                        </div>
                        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12, marginTop: 8 }}>
                            <div>Total prestado: Bs {totalPrestado.toLocaleString()}</div>
                            <div>Total pagado: Bs {totalPagado.toLocaleString()}</div>
                            <div style={{ color: "#dc2626", fontWeight: "bold" }}>
                                Saldo pendiente: Bs {totalSaldo.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Registrar pago: solo si hay préstamos activos con saldo */}
                    {prestamosActivos.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{ marginBottom: 8 }}>💵 Registrar pago</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {prestamosActivos.map((p) => (
                                    <div
                                        key={p.id}
                                        style={{
                                            border: "1px solid #e5e7eb",
                                            borderRadius: 8,
                                            padding: 12,
                                            background: "white",
                                        }}
                                    >
                                        <div style={{ marginBottom: 4 }}>
                                            Préstamo Bs {Number(p.monto).toLocaleString()} — Saldo: Bs{" "}
                                            {Number(p.saldo_pendiente).toLocaleString()}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleAbrirPagar(p)}
                                            style={{
                                                padding: "6px 12px",
                                                background: "#16a34a",
                                                color: "white",
                                                border: "none",
                                                borderRadius: 6,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Pagar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Modal / formulario de pago */}
                    {pagoModal && (
                        <div
                            style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0,0,0,0.4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1000,
                            }}
                            onClick={() => !enviando && setPagoModal(null)}
                        >
                            <div
                                style={{
                                    background: "white",
                                    padding: 24,
                                    borderRadius: 12,
                                    maxWidth: 360,
                                    width: "90%",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 style={{ marginTop: 0 }}>Registrar pago</h3>
                                <p style={{ color: "#6b7280", fontSize: 14 }}>
                                    Saldo pendiente: Bs {Number(pagoModal.saldo_pendiente).toLocaleString()}
                                </p>
                                <form onSubmit={handleRegistrarPago}>
                                    <div style={{ marginBottom: 12 }}>
                                        <label style={{ display: "block", marginBottom: 4 }}>Monto (Bs)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={pagoModal.saldo_pendiente}
                                            value={pagoMonto}
                                            onChange={(e) => setPagoMonto(e.target.value)}
                                            required
                                            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: "block", marginBottom: 4 }}>Fecha</label>
                                        <input
                                            type="date"
                                            value={pagoFecha}
                                            onChange={(e) => setPagoFecha(e.target.value)}
                                            required
                                            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }}
                                        />
                                    </div>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                        <button
                                            type="button"
                                            onClick={() => setPagoModal(null)}
                                            disabled={enviando}
                                            style={{
                                                padding: "8px 16px",
                                                background: "#e5e7eb",
                                                border: "none",
                                                borderRadius: 6,
                                                cursor: enviando ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={enviando}
                                            style={{
                                                padding: "8px 16px",
                                                background: "#16a34a",
                                                color: "white",
                                                border: "none",
                                                borderRadius: 6,
                                                cursor: enviando ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            {enviando ? "Guardando…" : "Registrar pago"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <h3 style={{ marginBottom: 8 }}>Historial</h3>
                    <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                        {historial.length === 0 ? (
                            <p style={{ color: "#6b7280" }}>Sin movimientos.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {historial.map((h) => (
                                    <div
                                        key={h.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            padding: 8,
                                            background: h.tipo === "pago" ? "#f0fdf4" : "#fffbeb",
                                            borderRadius: 6,
                                        }}
                                    >
                                        <span>{h.tipo === "prestamo" ? "➕ Préstamo" : "💵 Pago"}</span>
                                        <span style={{ fontWeight: 600 }}>
                                            {h.monto >= 0 ? "+" : ""}
                                            {h.monto.toLocaleString()}
                                        </span>
                                        <span style={{ color: "#6b7280" }}>{formatFecha(h.fecha)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
}
