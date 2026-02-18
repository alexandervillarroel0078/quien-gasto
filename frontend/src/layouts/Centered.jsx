export default function Centered({ children }) {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f5f6f8",
        }}>
            {children}
        </div>
    );
}
