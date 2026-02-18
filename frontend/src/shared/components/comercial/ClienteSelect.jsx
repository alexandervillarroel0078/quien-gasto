import { useState, useMemo } from "react";

export default function ClienteSelect({
  label = "Cliente",
  value,
  clientes = [],
  onSelect,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selected = clientes.find(c => String(c.id) === String(value));

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    if (!query) return clientes;

    return clientes.filter(c =>
      (c.razon_social || "").toLowerCase().includes(query) ||
      (c.documento || "").includes(query)
    );
  }, [q, clientes]);

  return (
    <div style={{ position: "relative" }}>
      {label && <div style={ui.label}>{label}</div>}

      {/* INPUT PRINCIPAL */}
      <input
        type="text"
        readOnly
        disabled={disabled}
        value={selected ? (selected.razon_social) : ""}
        onClick={() => !disabled && setOpen(true)}
        style={ui.input}
      />

      {/* POPUP */}
      {open && (
        <div style={ui.popup}>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar cliente…"
            style={ui.search}
          />

          <div style={ui.list}>
            {filtered.map(c => (
              <div
                key={c.id}
                style={ui.item}
                onClick={() => {
                  onSelect(c);
                  setOpen(false);
                  setQ("");
                }}
              >
                <b>{c.razon_social}</b>
                <div style={ui.meta}>{c.documento}</div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={ui.empty}>Sin resultados</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
const FIELD_HEIGHT = 38;

const ui = {
  label: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 2,
  },

  input: {
    width: "100%",
    height: FIELD_HEIGHT,
    padding: "0 8px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    cursor: "pointer",
    boxSizing: "border-box",
    background: "#fff",
  },

  popup: {
    position: "absolute",
    top: FIELD_HEIGHT + 6,
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 20,
    padding: 8,
  },

  search: {
    width: "100%",
    height: FIELD_HEIGHT,
    padding: "0 8px",
    borderRadius: 6,
    border: "1px solid #ccc",
    marginBottom: 8,
    fontSize: 14,
  },

  list: {
    maxHeight: 240,
    overflowY: "auto",
  },

  item: {
    padding: 8,
    borderRadius: 6,
    cursor: "pointer",
  },

  meta: {
    fontSize: 12,
    opacity: 0.6,
  },

  empty: {
    padding: 10,
    textAlign: "center",
    opacity: 0.6,
  },
};
