export default function FormCard({
  title,
  children,
  actions,
}) {
  return (
    <div style={ui.card}>
      {title && (
        <div style={ui.header}>
          <div style={ui.title}>{title}</div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      {children}
    </div>
  );
}

const ui = {
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 16,
    background: "#fff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontWeight: 700,
  },
};
