import { useState } from "react";
import useAuth from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const enviar = async () => {
        try {
            await login(correo, password);
            navigate("/");
        } catch {
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div style={styles.container}>

            {/* 🔵 Imagen izquierda */}
            <div style={styles.image}></div>

            {/* 🔵 Contenedor transparente */}
            <div style={styles.formContainer}>

                {/* 🔵 Tarjeta flotante */}
                <div style={styles.card}>
                    <h1 style={styles.title}>Login</h1>
                    <p style={styles.subtext}>Bienvenido de nuevo. Inicia sesión para continuar.</p>

                    <label style={styles.label}>Correo</label>
                    <input
                        type="email"
                        placeholder="Ingresa tu correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        style={styles.input}
                    />

                    <label style={styles.label}>Contraseña</label>
                    <div style={styles.passwordWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />

                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            style={styles.eyeButton}
                        >
                            {showPassword ? (
                                <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24">
                                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24">
                                    <path d="M1 1l22 22M12 5c-7 0-10 7-10 7a17 17 0 002.6 3.9M12 5c7 0 10 7 10 7a17 17 0 01-2.6 3.9" />
                                </svg>
                            )}
                        </div>

                    </div>

                    <button style={styles.button} onClick={enviar}>
                        Ingresar
                    </button>

                    <p style={styles.registerText}>
                        ¿No tienes cuenta?{" "}
                        <a style={styles.link}>
                            jajajajaja
                        </a>
                    </p>
                </div>
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
    // 🟦 TODO EL CONTENEDOR SIN COLOR OPACO
    container: {
        display: "flex",
        height: "100vh",
        backgroundImage: 'url("/imagen.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",

        color: "white",
        fontFamily: "'Segoe UI', sans-serif",
    },
    imageOverlay: {
        flex: 1,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(4px)",
    },
    // 🟦 Lado derecho totalmente transparente
    formContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent", // 👈 ¡sin gris, sin negro!
    },

    // 🟦 Tarjeta flotante glassmorphism
    card: {
        width: "380px",
        padding: "40px",

        background: "rgba(0, 0, 0, 0.30)",
        backdropFilter: "blur(12px)",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.4)",

        display: "flex",
        flexDirection: "column",
    },

    title: {
        fontSize: "32px",
        marginBottom: "5px",
    },

    subtext: {
        color: "#9ca3af",
        marginBottom: "25px",
    },

    label: {
        marginBottom: "6px",
        fontSize: "15px",
        color: "#d1d5db",
    },

    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "6px",
        border: "1px solid #222",
        background: "#161b22",
        color: "white",
        fontSize: "16px",
        outline: "none",
        width: "350px",
    },

    passwordWrapper: {
        position: "relative",
    },

    eyeButton: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-80%)",
        width: "32px",
        height: "32px",
        borderRadius: "9px",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: "0.2s",
    },


    button: {
        background: "#3b82f6",
        border: "none",
        padding: "12px",
        borderRadius: "8px",
        color: "white",
        fontSize: "18px",
        cursor: "pointer",
        transition: "0.2s",
        marginTop: "5px",
        width: "375px",
    },

    registerText: {
        marginTop: "20px",
        color: "#9ca3af",
        textAlign: "center",
    },

    link: {
        color: "#3b82f6",
        textDecoration: "none",
    },
};
