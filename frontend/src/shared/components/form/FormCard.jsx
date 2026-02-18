import { colors, spacing } from "../../theme/ui";

export default function FormCard({ title, children }) {
  return (
    <div style={styles.card}>
      {title && <h2 style={styles.title}>{title}</h2>}
      {children}
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: 420,
    background: colors.background,
    padding: spacing.lg,
    borderRadius: 10,
    border: `1px solid ${colors.border}`,
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.md,
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
  },
};
