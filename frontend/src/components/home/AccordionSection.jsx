import { Link } from "react-router-dom";

export default function AccordionSection({
  title,
  icon,
  open,
  onToggle,
  items,
  isActive,
  styles,
}) {
  return (
    <>
      <div style={styles.accordionHeader} onClick={onToggle}>
        <span style={styles.headerLeft}>
          {icon} {title}
        </span>
        <span className={open ? "arrow open" : "arrow"} />
      </div>

      {open && (
        <div style={styles.accordionBody}>
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{ ...styles.subLink, ...isActive(item.path) }}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
