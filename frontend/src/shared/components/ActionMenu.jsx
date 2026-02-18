import { useState } from "react";

export default function ActionMenu({
  primaryAction,
  items = [],
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={styles.wrapper}>
      {/* Acción principal */}
      {primaryAction}

      {/* Botón menú */}
      {items.length > 0 && (
        <button
          style={styles.menuBtn}
          onClick={() => setOpen(o => !o)}
        >
          ⋮
        </button>
      )}

      {/* Menú */}
      {open && (
        <div style={styles.menu}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                ...styles.menuItem,
                ...(item.danger ? styles.danger : {}),
              }}
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
            >
              {item.icon && (
                <span style={styles.icon}>{item.icon}</span>
              )}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    position: "relative",
  },

  menuBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 18,
    padding: "4px 6px",
    borderRadius: 6,
    lineHeight: 1,
  },

  menu: {
    position: "absolute",
    top: "100%",
    right: 0,
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 8,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    zIndex: 20,
    minWidth: 150,
    marginTop: 6,
  },

  menuItem: {
    padding: "8px 12px",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  icon: {
    fontSize: 14,
  },

  danger: {
    color: "#e53935",
    fontWeight: 500,
  },
};
