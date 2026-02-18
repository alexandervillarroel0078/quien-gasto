
import { useLocation, useNavigate } from "react-router-dom";

export default function NoAutorizado() {
    const navigate = useNavigate();
    const location = useLocation();

    // ruta desde la que vino (si existe)
    const fromPath = location.state?.from?.pathname;

    const volver = () => {
        // si tenemos origen, vuelve ahí (pero OJO: puede ser prohibida)
        // por eso lo mejor es ir a inicio como fallback seguro
        if (fromPath && fromPath !== "/no-autorizado") {
            navigate(fromPath, { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🚫 Acceso denegado</h1>
                <p style={styles.text}>No tienes permisos para acceder a esta sección.</p>

                <div style={styles.actions}>
                    <button style={styles.btnPrimary} onClick={volver}>
                        ⬅️ Volver
                    </button>

                    <button style={styles.btnSecondary} onClick={() => navigate("/", { replace: true })}>
                        🏠 Ir al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f6f8" },
    card: { background: "white", padding: 30, borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.1)", textAlign: "center", width: 380 },
    title: { marginBottom: 10, fontSize: 26 },
    text: { color: "#555", marginBottom: 25 },
    actions: { display: "flex", gap: 12, justifyContent: "center" },
    btnPrimary: { padding: "10px 18px", background: "#1e88e5", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" },
    btnSecondary: { padding: "10px 18px", background: "#9e9e9e", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" },
};
