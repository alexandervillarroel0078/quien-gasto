export default function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  minHeight = 38,
}) {
  return (
    <div style={{ flex: 1 }}>
      {label && (
        <div style={ui.label}>{label}</div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          ...ui.textarea,
          minHeight,
        }}
      />
    </div>
  );
}

const ui = {
  label: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 2,
  },

  textarea: {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    resize: "vertical",
    fontFamily: "inherit",
    fontSize: 14,
  },
};
