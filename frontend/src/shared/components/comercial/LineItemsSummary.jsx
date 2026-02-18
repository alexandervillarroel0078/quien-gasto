export default function LineItemsSummary({
  items = [],
  showDiscount = true,
}) {
  const numberOr0 = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const totals = items.reduce(
    (acc, it) => {
      const c = numberOr0(it.cantidad);
      const p = numberOr0(it.precio);
      const d = numberOr0(it.descuento);

      const bruto = c * p;

      acc.subtotal += bruto;
      acc.descuento += d;
      acc.total += Math.max(0, bruto - d);

      return acc;
    },
    { subtotal: 0, descuento: 0, total: 0 }
  );

  if (items.length === 0) return null;

  return (
    <div style={ui.wrap}>
      <div style={ui.row}>
        <span>Subtotal</span>
        <strong>{totals.subtotal.toFixed(2)}</strong>
      </div>

      {showDiscount && totals.descuento > 0 && (
        <div style={ui.row}>
          <span>Descuento</span>
          <strong>-{totals.descuento.toFixed(2)}</strong>
        </div>
      )}

      <div style={ui.total}>
        <span>Total</span>
        <strong>{totals.total.toFixed(2)}</strong>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const ui = {
  wrap: {
    minWidth: 220,
    marginTop: 12,
    marginLeft: "auto",
    borderTop: "1px solid #e5e7eb",
    paddingTop: 8,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 900,
    fontSize: 16,
  },
};
