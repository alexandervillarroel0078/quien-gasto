export default function DocumentCode({
  label = "Código",
  value,
  extraLabel,
  extraValue,
}) {
  return (
    <div style={ui.wrap}>
      <div>
        <div style={ui.label}>{label}</div>
        <div style={ui.code}>{value || "—"}</div>
      </div>

      {extraLabel && (
        <div>
          <div style={ui.label}>{extraLabel}</div>
          <div style={ui.code}>{extraValue || "—"}</div>
        </div>
      )}
    </div>
  );
}

const ui = {
  wrap: {
    display: "flex",
    gap: 20,
    alignItems: "flex-end",
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
  },
  code: {
    fontWeight: 700,
  },
};
