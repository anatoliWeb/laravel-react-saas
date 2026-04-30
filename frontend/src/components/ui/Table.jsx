function Table({ columns = [], rows = [] }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length || 1}>No data yet</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={`row-${index}`}>
                {row.map((value, cellIndex) => (
                  <td key={`cell-${cellIndex}`}>{value}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
