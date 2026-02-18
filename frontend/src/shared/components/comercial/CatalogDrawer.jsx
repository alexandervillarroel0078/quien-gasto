// src/shared/components/comercial/CatalogDrawer.jsx
import { useMemo } from "react";

export default function CatalogDrawer({
  open = false,
  onToggle,
  tabs = [],
  activeTab,
  onTabChange,
  items = [],
  search = "",
  onSearchChange,
  onAddItem,
  soloLectura = false,
  width = 360,
}) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;

    return items.filter((x) => {
      const name = String(x.nombre ?? x.descripcion ?? "").toLowerCase();
      const cod = String(
        x.codigo ?? x.codigo_interno ?? x.sku ?? ""
      ).toLowerCase();
      return name.includes(q) || cod.includes(q);
    });
  }, [items, search]);

  return (
    <div style={ui.side(open, width)}>
      {/* <div style={ui.header}>
        <strong>Catálogo</strong>
        <button
          type="button"
          onClick={() => onToggle?.(!open)}
          style={ui.collapseBtn}
        >
          {open ? "⟨" : "⟩"}
        </button>
      </div> */}

      {!open ? null : (
        <>
          {tabs.length > 0 && (
            <div style={ui.tabs}>
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTabChange?.(t)}
                  style={t === activeTab ? ui.tabActive : ui.tab}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <div style={ui.searchBox}>
            <input
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Buscar…"
              disabled={soloLectura}
              style={ui.searchInput}
            />
          </div>

          <div style={ui.list}>
            {filtered.length === 0 ? (
              <div style={ui.empty}>Sin resultados</div>
            ) : (
              filtered.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  disabled={soloLectura}
                  style={ui.row}
                  onClick={() => onAddItem?.(it)}
                >
                  <strong>{it.nombre || it.descripcion}</strong>
                  <div style={ui.meta}>
                    ID: {it.id}
                    {it.codigo && ` · ${it.codigo}`}
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

const ui = {
  side: (open, width) => ({
    width: open ? width : 40,
    height: "100%",        // 👈 NO 100vh
    flexShrink: 0,
    borderLeft: "1px solid #e5e7eb",
    background: "#fff",
    transition: "width 0.25s ease",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  }),

  header: {
    padding: 12,
    borderBottom: "1px solid #eee",
    fontWeight: 700,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },

  collapseBtn: {
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: 6,
    cursor: "pointer",
    padding: "4px 8px",
    fontWeight: 900,
  },

  tabs: {
    display: "flex",
    gap: 8,
    padding: 10,
    flexShrink: 0,
  },

  tab: {
    flex: 1,
    padding: 8,
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: 6,
    cursor: "pointer",
  },

  tabActive: {
    flex: 1,
    padding: 8,
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    borderRadius: 6,
    fontWeight: 700,
  },

  searchBox: {
    padding: 10,
    flexShrink: 0,
  },

  searchInput: {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },

  list: {
    padding: 10,
    flex: 1,                // 👈 ocupa el resto
    minHeight: 0,            // 👈 CLAVE
    overflowY: "auto",       // 👈 scroll SOLO aquí
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  row: {
    textAlign: "left",
    padding: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
  },

  meta: {
    fontSize: 12,
    opacity: 0.6,
  },

  empty: {
    textAlign: "center",
    opacity: 0.6,
    padding: 20,
  },
};

