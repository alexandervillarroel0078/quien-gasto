import Button from "./Button";

export default function Drawer({
  open,
  onClose,
  title,
  width = 700,
  children,
}) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div style={styles.overlay} onClick={onClose} />

      {/* Drawer */}
      <aside style={styles.drawer(width)}>
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <Button variant="gray" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div style={styles.content}>{children}</div>
      </aside>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 1000,
  },

  drawer: (width) => ({
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: "100%",
    maxWidth: width,
    background: "#f5f6f8",
    boxShadow: "-6px 0 20px rgba(0,0,0,0.25)",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column",

    /* 👇 RESPONSIVE */
    transition: "transform 0.25s ease",
  }),

  header: {
    padding: "14px 16px",
    background: "#ffffff",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  },

  content: {
    padding: 16,
    overflowY: "auto",
    flex: 1,
  },
};
