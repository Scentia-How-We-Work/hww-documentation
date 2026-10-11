function Table({ columns, rows }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={column.key}>
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))
        }
      </tbody>
    </table>
  )
}

export default Table

{/* thead is table head while th is a header cell!! confusing but we move */}

{/* table body breakdown get it into your skull */}
{/* go through every item in the array and create a row (tr) for each one */}
{/* td = table data cell, wish it was tada */}
{/* match column.key to row contents key to render the corresponding cell */}