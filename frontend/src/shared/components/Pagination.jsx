import Button from "./Button";
import { colors, spacing } from "../theme/ui";

export default function Pagination({ page, pages, onPrev, onNext }) {
  if (pages <= 1) return null;

  return (
    <div style={ui.container}>
      <Button size="sm" disabled={page <= 1} onClick={onPrev}>
        ◀ Anterior
      </Button>

      <span style={ui.label}>
        Página {page} de {pages}
      </span>

      <Button size="sm" disabled={page >= pages} onClick={onNext}>
        Siguiente ▶
      </Button>
    </div>
  );
}

const ui = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  label: {
    padding: `${spacing.xs}px ${spacing.sm}px`,
    fontSize: 14,
    fontWeight: 500,
    color: colors.text,
    background: colors.backgroundMuted,
    borderRadius: 6,
    border: `1px solid ${colors.border}`,
  },
};
