// frontend/src/components/home/Bienvenida.jsx

import useAuth from "../../auth/useAuth";

export default function Bienvenida() {
    const { user } = useAuth();
    const username = user?.correo?.split("@")[0] || "Usuario";

    return (
        <div style={styles.card}>
            <div>
                <h1 style={styles.title}>
                    Bienvenido {username} 👋
                </h1>

                <p style={styles.subtitle}>
                    quien gasto eh! · Panel principal
                </p>
            </div>

            <div style={styles.badge}>
                Buen día!, Listo para registrar movimientos
            </div>
        </div>
    );
}

/*  
------------------------------------
        🔽 ESTILOS ABAJO 🔽
------------------------------------
*/

const styles = {
    card: {
        background: "rgba(22, 23, 32, 0.96)",
        borderRadius: 20,
        padding: "24px 26px",
        marginBottom: 25,
        boxShadow: "0 10px 35px rgba(0,0,0,0.45)",
        border: "1px solid rgba(255,255,255,0.04)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#ffffff",
        fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },

    title: {
        fontSize: 28,
        fontWeight: 700,
        margin: 0,
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 14,
        color: "#9b9ca6",
        margin: 0,
    },

    badge: {
        background: "linear-gradient(135deg, #ff8a3c, #ff4d00 70%)",
        padding: "10px 20px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        color: "#1b0f06",
        boxShadow: "0 6px 15px rgba(255, 77, 0, 0.45)",
        whiteSpace: "nowrap",
    },
};
