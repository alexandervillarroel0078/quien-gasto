// frontend/src/layouts/Layout.jsx
import Navbar from "../components/home/Navbar";

export default function Layout({ children }) {
    return (
        <div style={{ display: "flex" }}>
            <Navbar />

            <div style={{ marginLeft: 260, padding: "20px", width: "100%" }}>
                {children}
            </div>
        </div>
    );
}
