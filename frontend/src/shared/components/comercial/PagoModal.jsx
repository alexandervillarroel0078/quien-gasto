import { useState } from "react";

export default function PagoModal({ open, total, onClose, onConfirm }) {
  // ✅ 1) HOOKS PRIMERO (sin nada antes)
  const [metodo, setMetodo] = useState("EFECTIVO");
  const [efectivo, setEfectivo] = useState("");
  const [qr, setQr] = useState("");
  const [comprobante, setComprobante] = useState(null);

  // ✅ 2) Recién después el return condicional
  if (!open) return null;
  const confirmar = () => {
    onConfirm({
      metodo,
      total,
      efectivo: Number(efectivo) || 0,
      qr: Number(qr) || 0,
      comprobante,
    });
  };

  return (
    <div style={ui.backdrop}>
      <div style={ui.modal}>
        {/* HEADER */}
        <div style={ui.header}>
          <strong>Cobrar</strong>
          <button onClick={onClose}>✕</button>
        </div>

        {/* TOTAL */}
        <div style={ui.total}>
          Total: Bs {total}
        </div>

        {/* METODO */}
        <div style={ui.methods}>
          {["EFECTIVO", "QR", "COMBINADO"].map((m) => (
            <button
              key={m}
              onClick={() => setMetodo(m)}
              style={{
                ...ui.methodBtn,
                ...(metodo === m ? ui.methodActive : {}),
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* CONTENIDO */}
        {metodo === "EFECTIVO" && (
          <input
            placeholder="Monto recibido"
            value={efectivo}
            onChange={(e) => setEfectivo(e.target.value)}
            style={ui.input}
          />
        )}

        {metodo === "QR" && (
          <input
            placeholder="Monto QR"
            value={qr}
            onChange={(e) => setQr(e.target.value)}
            style={ui.input}
          />
        )}

        {metodo === "COMBINADO" && (
          <>
            <input
              placeholder="Efectivo"
              value={efectivo}
              onChange={(e) => setEfectivo(e.target.value)}
              style={ui.input}
            />
            <input
              placeholder="QR"
              value={qr}
              onChange={(e) => setQr(e.target.value)}
              style={ui.input}
            />
          </>
        )}

        {/* COMPROBANTE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setComprobante(e.target.files[0])}
        />

        {/* FOOTER */}
        <div style={ui.footer}>
          <button onClick={onClose}>Cancelar</button>
          <button style={ui.confirm} onClick={confirmar}>
            Confirmar cobro
          </button>
        </div>
      </div>
    </div>
  );
}

const ui = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modal: {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
    width: 360,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  total: {
    fontSize: 18,
    fontWeight: 700,
  },
  methods: {
    display: "flex",
    gap: 8,
  },
  methodBtn: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    background: "#fff",
  },
  methodActive: {
    background: "#2563eb",
    color: "#fff",
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },
  confirm: {
    background: "#16a34a",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 6,
  },
};
