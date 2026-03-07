// // frontend/src/components/home/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../auth/useAuth";
import AccordionSection from "./AccordionSection";

/* =====================
   CONFIGURACIÓN DEL MENÚ
===================== */
const NAV_MODULES = {
  movimientos: {
    title: "Movimientos",
    icon: "💸",
    routes: ["/aportes", "/gastos", "/categorias-gasto"],
    items: [
      { label: "Aportes", path: "/aportes", icon: "💰" },
      { label: "Gastos", path: "/gastos", icon: "🧾" },
      { label: "Categorías de gasto", path: "/categorias-gasto", icon: "📁" },
    ],
  },

  periodos: {
    title: "Periodos",
    icon: "🗓️",
    routes: ["/periodos"],
    items: [
      { label: "Periodos", path: "/periodos", icon: "📆" },
    ],
  },

  resumen: {
    title: "Resumen",
    icon: "📊",
    routes: ["/resumen"],
    items: [
      { label: "Resumen por periodo", path: "/resumen", icon: "📈" },
    ],
  },

  personas: {
    title: "Personas",
    icon: "👥",
    routes: ["/personas"],
    items: [
      { label: "Personas", path: "/personas", icon: "👤" },
    ],
  },

  reportes: {
    title: "Reportes",
    icon: "📈",
    routes: ["/reportes"],
    items: [
      { label: "Reportes", path: "/reportes", icon: "📊" },
    ],
  },

  auditoria: {
    title: "Auditoría",
    icon: "📜",
    routes: ["/bitacora"],
    items: [
      { label: "Bitácora", path: "/bitacora", icon: "🕒" },
    ],
  },
  banco: {
    title: "Banco",
    icon: "🏦",
    routes: [
      "/cuentas",
      "/movimientos",
      "/categorias-movimiento",
      "/banco/reportes", // 👈 NUEVO
    ],
    items: [
      { label: "Cuentas", path: "/cuentas", icon: "💳" },
      { label: "Movimientos", path: "/movimientos", icon: "💸" },
      { label: "Categorías Movimiento", path: "/categorias-movimiento", icon: "📂" },
      { label: "Reportes", path: "/banco/reportes", icon: "📊" }, // 👈 NUEVO
    ],
  },
  prestamos: {
    title: "Deudas",
    icon: "💰",
    routes: ["/deudas"],
    items: [
      { label: "Deudas", path: "/deudas", icon: "💰" },
    ],
  },

};


export default function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const [open, setOpen] = useState({});

  /* =====================
     ABRIR SEGÚN RUTA
  ===================== */
  useEffect(() => {
    const updated = {};
    Object.entries(NAV_MODULES).forEach(([key, mod]) => {
      updated[key] = mod.routes.some((r) =>
        location.pathname.startsWith(r)
      );
    });
    setOpen(updated);
  }, [location.pathname]);

  const initials = (user?.nombre || "Usuario")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? { background: "#1f2029", color: "#ffffff" }
      : {};

  return (
    <aside style={styles.sidebar}>
      {/* MARCA */}
      <div style={styles.brand}>
        <div style={styles.brandDot} />
        <span>Quién Gastó</span>
      </div>

      {/* NAVEGACIÓN */}
      <nav style={styles.navSection}>
        <Link to="/" style={{ ...styles.link, ...isActive("/") }}>
          🏠 Home
        </Link>

        {Object.entries(NAV_MODULES).map(([key, mod]) => {
          if (mod.adminOnly && user?.rol !== "ADMIN") return null;

          return (
            <AccordionSection
              key={key}
              title={mod.title}
              icon={mod.icon}
              open={open[key]}
              onToggle={() =>
                setOpen({ ...open, [key]: !open[key] })
              }
              items={mod.items}
              isActive={isActive}
              styles={styles}
            />
          );
        })}

      </nav>

      {/* USUARIO */}
      <div>
        <div style={styles.bottomUser}>
          <div style={styles.avatar}>{initials}</div>
          <div>
            <div style={{ fontWeight: 500 }}>{user?.nombre}</div>
            <div style={{ fontSize: 12, color: "#8a8b95" }}>
              {user?.rol}
            </div>
          </div>
        </div>

        <button style={styles.logoutBtn} onClick={logout}>
          ⏏ Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

/* =====================
        ESTILOS
===================== */

const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 260,
    height: "100vh",
    background: "#111217",
    padding: "24px 20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid #2b2d33",
    color: "#ffffff",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    fontWeight: 600,
    fontSize: 20,
  },

  brandDot: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: "radial-gradient(circle, #ff8a3c, #ff4d00)",
  },

  navSection: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  accordionHeader: {
    padding: "10px 14px",
    borderRadius: 12,
    cursor: "pointer",
    color: "#d6d7e0",
    display: "flex",
    alignItems: "center",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  accordionBody: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    paddingLeft: 16,
  },

  link: {
    padding: "10px 14px",
    borderRadius: 12,
    textDecoration: "none",
    color: "#9b9ca6",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  subLink: {
    padding: "8px 14px",
    borderRadius: 10,
    textDecoration: "none",
    color: "#9b9ca6",
    fontSize: 13,
  },

  bottomUser: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px",
    borderRadius: 12,
    background: "#191a21",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#ff6a2c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  },

  logoutBtn: {
    marginTop: 8,
    background: "transparent",
    border: "none",
    color: "#9b9ca6",
    cursor: "pointer",
  },
};
