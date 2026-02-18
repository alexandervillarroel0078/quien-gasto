export default function FormSelect({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  options = [],
}) {
  return (
    <>
      <label>
        {label}
        {required && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
      </label>
      <select
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
          background: "white",
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </>
  );
}
