function Table({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-mist-200">
      <table className="w-full border-collapse text-left">
        <thead className="bg-mist-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key}
                className="border-b border-mist-200 px-4 py-3 text-sm font-semibold text-mist-700 bg-white"
              >{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className="border-b border-mist-100 last:border-b-0 bg-white"
            >
              {columns.map((column) => (
                <td 
                  key={column.key}
                  className="px-4 py-3 text-sm text-mist-600"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Table

{/* thead is table head while th is a header cell!! confusing but we move */}

{/* table body breakdown get it into your skull */}
{/* go through every item in the array and create a row (tr) for each one */}
{/* td = table data cell, wish it was tada */}
{/* match column.key to row contents key to render the corresponding cell */}