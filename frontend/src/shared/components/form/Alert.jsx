export default function Alert({ type = "error", message }) {
  if (!message) return null;

  const styles = {
    error: {
      bg: "#fdecea",
      color: "#b71c1c",
      icon: "⛔",
    },
    info: {
      bg: "#e8f4fd",
      color: "#0c5460",
      icon: "ℹ️",
    },
    success: {
      bg: "#e6f4ea",
      color: "#1e7e34",
      icon: "✅",
    },
    warning: {
      bg: "#fff4e5",
      color: "#8a6d1d",
      icon: "⚠️",
    },
  };

  const s = styles[type];

  return (
    <div
      style={{
        background: s.bg,
        color: s.color,
        padding: "10px 12px",
        borderRadius: 6,
        marginBottom: 12,
        fontSize: 14,
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      <span>{s.icon}</span>
      <span>{message}</span>
    </div>
  );
}
