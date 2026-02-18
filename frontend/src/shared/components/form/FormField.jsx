import { colors, spacing } from "../../theme/ui";

export default function FormField({ label, children }) {
  return (
    <div style={styles.field}>
      {label && <label style={styles.label}>{label}</label>}
      {children}
    </div>
  );
}

export const inputStyle = {
  padding: spacing.sm,
  borderRadius: 6,
  border: `1px solid ${colors.border}`,
  color: colors.text,
};

const styles = {
  field: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    color: colors.text,
  },
};
