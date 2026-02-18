import Button from "./Button";

export default function PageHeader({
  title,
  actionLabel,
  onAction,
  showAction = true,

  // 👇 NUEVO (opcionales)
  searchValue,
  onSearch,
  searchPlaceholder = "Buscar...",
}) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{title}</h2>

      <div style={styles.right}>
        {/* 🔍 Buscador */}
        {onSearch && (
          <input
            type="text"
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={e => onSearch(e.target.value)}
            style={styles.search}
          />
        )}

        {/* ➕ Acción */}
        {showAction && actionLabel && (
          <Button variant="primary" size="lg" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  right: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: 600,
    margin: 0,
  },

  search: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ddd",
    minWidth: 240,
  },
};
