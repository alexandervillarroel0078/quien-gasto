import { inputStyle } from "./FormField";

export default function Select(props) {
  return (
    <select
      style={{ ...inputStyle, background: "white" }}
      {...props}
    />
  );
}
