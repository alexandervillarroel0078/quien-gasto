import { ui } from "../styles/ui";

export default function PageHeader({ title, action }) {
  return (
    <div style={ui.pageHeader}>
      <h2 style={{ ...ui.title, margin: 0 }}>{title}</h2>
      {action}
    </div>
  );
}
