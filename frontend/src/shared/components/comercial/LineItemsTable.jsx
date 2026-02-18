// src/shared/components/comercial/LineItemsTable.jsx
export default function LineItemsTable({
  items,
  onChange,
  soloLectura = false,
  config = {},
}) {
  const {
    allowDiscount = true,
    allowRemove = true,
    showTipo = true,
  } = config;

  const numberOr0 = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const update = (i, field, value) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [field]: value };
    onChange(copy);
  };

  const remove = (i) => {
    onChange(items.filter((_, idx) => idx !== i));
  };

  return (
    <div style={ui.wrap}>
      <table style={ui.table}>
        <thead>
          <tr>
            {showTipo && <th style={ui.th}>Tipo</th>}
            <th style={ui.th}>Item</th>
            <th style={ui.thRight}>Cant.</th>
            <th style={ui.thRight}>Precio</th>
            {allowDiscount && <th style={ui.thRight}>Desc.</th>}
            <th style={ui.thRight}>Subtotal</th>
            {allowRemove && <th style={ui.thAction} />}
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={
                  3 +
                  (showTipo ? 1 : 0) +
                  (allowDiscount ? 1 : 0) +
                  (allowRemove ? 1 : 0)
                }
                style={ui.emptyRow}
              >
                No hay ítems
              </td>
            </tr>
          ) : (
            items.map((it, i) => {
              const subtotal =
                numberOr0(it.cantidad) *
                  numberOr0(it.precio) -
                numberOr0(it.descuento);

              return (
                <tr key={`${it.tipo}-${it.item_id}-${i}`}>
                  {showTipo && (
                    <td style={ui.td}>
                      <span
                        style={
                          it.tipo === "PRODUCTO"
                            ? ui.badgeBlue
                            : ui.badgePurple
                        }
                      >
                        {it.tipo}
                      </span>
                    </td>
                  )}

                  <td style={ui.td}>
                    <div style={ui.itemName}>{it.nombre}</div>
                    {it.item_id && (
                      <div style={ui.itemMeta}>
                        ID: {it.item_id}
                      </div>
                    )}
                  </td>

                  <td style={ui.tdRight}>
                    <input
                      type="number"
                      value={it.cantidad}
                      disabled={soloLectura}
                      onChange={(e) =>
                        update(i, "cantidad", e.target.value)
                      }
                      style={ui.inputMini}
                    />
                  </td>

                  <td style={ui.tdRight}>
                    <input
                      type="number"
                      value={it.precio}
                      disabled={soloLectura}
                      onChange={(e) =>
                        update(i, "precio", e.target.value)
                      }
                      style={ui.inputMini}
                    />
                  </td>

                  {allowDiscount && (
                    <td style={ui.tdRight}>
                      <input
                        type="number"
                        value={it.descuento || 0}
                        disabled={soloLectura}
                        onChange={(e) =>
                          update(i, "descuento", e.target.value)
                        }
                        style={ui.inputMini}
                      />
                    </td>
                  )}

                  <td style={ui.tdRightStrong}>
                    {Math.max(0, subtotal).toFixed(2)}
                  </td>

                  {allowRemove && (
                    <td style={ui.tdAction}>
                      {!soloLectura && (
                        <button
                          onClick={() => remove(i)}
                          style={ui.btnRemove}
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ================= STYLES ================= */

const ui = {
  wrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    fontSize: 12,
    opacity: 0.7,
    padding: "10px 8px",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },

  thRight: {
    textAlign: "right",
    fontSize: 12,
    opacity: 0.7,
    padding: "10px 8px",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },

  thAction: {
    width: 40,
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
  },

  tdRight: {
    padding: "10px 8px",
    borderBottom: "1px solid #f1f5f9",
    textAlign: "right",
    verticalAlign: "top",
  },

  tdRightStrong: {
    padding: "10px 8px",
    borderBottom: "1px solid #f1f5f9",
    textAlign: "right",
    fontWeight: 800,
  },

  tdAction: {
    padding: "10px 8px",
    borderBottom: "1px solid #f1f5f9",
    textAlign: "right",
    verticalAlign: "top",
  },

  emptyRow: {
    padding: 18,
    textAlign: "center",
    opacity: 0.6,
  },

  inputMini: {
    width: 90,
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid #ccc",
    textAlign: "right",
    fontSize: 13,
  },

  itemName: {
    fontWeight: 600,
  },

  itemMeta: {
    fontSize: 12,
    opacity: 0.6,
  },

  badgeBlue: {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    background: "#dbeafe",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
  },

  badgePurple: {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    background: "#ede9fe",
    border: "1px solid #ddd6fe",
    color: "#6d28d9",
  },

  btnRemove: {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: 6,
    cursor: "pointer",
    padding: "6px 10px",
    fontWeight: 900,
  },
};
