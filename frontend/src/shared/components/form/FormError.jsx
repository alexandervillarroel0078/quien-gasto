// src\shared\components\form\FormError.jsx
export default function FormError({ message }) {
  if (!message) return null;

  return (
    <div style={{
      background: "#ffe5e5",
      color: "#b00020",
      padding: 10,
      borderRadius: 6,
      marginBottom: 12,
      fontSize: 14,
    }}>
      {message}
    </div>
  );
}
