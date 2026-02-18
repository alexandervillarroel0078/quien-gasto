export default function EntitySelect({
  label,
  value,
  onChange,
  options = [],
  getKey = (x) => x.id,
  getLabel = (x) => x.nombre,
  placeholder = "Seleccione…",
  disabled = false,
  minWidth = 260,
}) {
  return (
    <div style={{ minWidth }}>
      {label && <div style={ui.label}>{label}</div>}
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={ui.select}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={getKey(o)} value={getKey(o)}>
            {getLabel(o)}
          </option>
        ))}
      </select>
    </div>
  );
}

const ui = {
  label: { fontSize: 11, opacity: 0.6, marginBottom: 2 },
  select: {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
};
