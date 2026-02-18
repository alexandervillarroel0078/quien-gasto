// shared/components/form/FormLayout.jsx
export default function FormLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}
