// frontend/src/pages/Home.jsx

import Navbar from "../components/home/Navbar";
import Bienvenida from "../components/home/Bienvenida";

export default function Home() {
    return (
        <div style={styles.container}>
            <Navbar />

            <main style={styles.main}>
                <Bienvenida />

                {/* aquí va lo demás */}
            </main>
        </div>
    );
}

/*  
------------------------------------
        🔽 ESTILOS ABAJO 🔽
------------------------------------
*/

const styles = {
    container: {
        display: "flex",
        minHeight: "100vh",
        background:
            "radial-gradient(circle at top left, #191b29, #06060a)",
    },

    main: {
        marginLeft: 260, // Sidebar width → evita superposición
        padding: "28px 32px",
        width: "100%",
        boxSizing: "border-box",
    },
};
