// frontend\src\shared\components\Button.jsx
import { colors } from "../theme/ui";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
}) {
  const variantStyle =
    variant === "danger"
      ? ui.btnDanger
      : variant === "gray"
      ? ui.btnGray
      : ui.btnPrimary;

  const sizeStyle =
    size === "sm"
      ? ui.btnSm
      : size === "lg"
      ? ui.btnLg
      : ui.btnMd;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...ui.btn,
        ...variantStyle,
        ...sizeStyle,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

const ui = {
  btn: {
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  },

  btnPrimary: {
    background: colors.primary,
    color: "#fff",
  },

  btnDanger: {
    background: colors.danger,
    color: "#fff",
  },

  btnGray: {
    background: colors.gray,
    color: "#222",
  },

  btnSm: {
    padding: "4px 8px",
    fontSize: 12,
  },

  btnMd: {
    padding: "8px 14px",
    fontSize: 14,
  },

  btnLg: {
    padding: "10px 16px",
    fontSize: 15,
  },
};
