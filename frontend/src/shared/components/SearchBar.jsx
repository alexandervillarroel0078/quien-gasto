import Button from "./Button";
import { colors, spacing } from "../theme/ui";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Buscar...",
}) {
  return (
    <div style={ui.container}>
      <input
        style={ui.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />

      <Button size="sm" onClick={onSearch}>
        Buscar
      </Button>

      <Button size="sm" variant="gray" onClick={onClear}>
        Limpiar
      </Button>
    </div>
  );
}
const ui = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  input: {
    flex: 1,
    padding: "8px 12px",
    fontSize: 14,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    outline: "none",
  },
};
