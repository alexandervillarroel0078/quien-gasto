import Button from "./Button";
import { colors, spacing } from "../theme/ui";

export default function FullScreenOverlay({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel = "Guardar",
  soloLectura = false,
  children,
}) {
  if (!open) return null;

  return (
    <div style={ui.overlay}>
      {/* HEADER */}
      <div style={ui.header}>
        <h2 style={ui.title}>{title}</h2>

        <div style={ui.actions}>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>

          {/* {!soloLectura && (
            <Button variant="primary" onClick={onSubmit}>
              {submitLabel}
            </Button>
          )} */}
        </div>
      </div>

      {/* BODY */}
      <div style={ui.body}>{children}</div>
    </div>
  );
}

/* =======================
   UI STYLES (theme/ui)
======================= */
const ui = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: colors.background,
    overflow: "auto",
  },

  header: {
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${spacing.lg}px`,
    background: colors.backgroundCard,
    borderBottom: `1px solid ${colors.border}`,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },

  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: colors.text,
  },

  actions: {
    display: "flex",
    gap: spacing.sm,
  },

  body: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: spacing.lg,
  },
};
