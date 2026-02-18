import { colors } from "../theme/ui";

export default function Table({
  columns,
  data,
  onRowClick,
  renderActions,
}) {
  return (
    <div style={ui.tableContainer}>
      <table style={ui.table}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={ui.tableHead}>
                {c.label}
              </th>
            ))}
            {renderActions && (
              <th style={ui.tableHead}>Acciones</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => {
            const isInactive = row.activo === false;

            return (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                style={{
                  ...ui.tableRow,
                  backgroundColor: isInactive
                    ? colors.rowDangerBg
                    : "transparent",
                  color: isInactive
                    ? colors.textDanger
                    : colors.text,
                }}
              >
                {columns.map(c => (
                  <td key={c.key} style={ui.tableCell}>
                    {c.render ? c.render(row, index) : row[c.key]}
                  </td>
                ))}

                {renderActions && (
                  <td
                    style={ui.tableCell}
                    onClick={e => e.stopPropagation()}
                  >
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
const ui = {
  tableContainer: {
    borderRadius: 10,
    background: "#fff",
    border: `1px solid ${colors.border}`,
    position: "relative", // 👈 importante
  },


  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 15,
  },

  tableHead: {
    background: colors.backgroundMuted,
    padding: "10px 12px",
    fontWeight: 600,
    borderBottom: `1px solid ${colors.border}`,
    textAlign: "left",
    color: colors.text,
  },

  tableRow: {
    borderBottom: `1px solid ${colors.borderSoft}`,
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  },

  tableCell: {
    padding: "8px 12px",
    verticalAlign: "middle",
  },
};
