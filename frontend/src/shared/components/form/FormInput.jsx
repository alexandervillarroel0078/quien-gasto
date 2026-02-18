export default function FormInput({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  type = "text",
  placeholder = "",
}) {
  return (
    <>
      <label>
        {label}
        {required && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />
    </>
  );
}
