// Low / Medium / High values (e.g. risk impact and likelihood) show as coloured tags
const levelStyles = {
  high: 'bg-high-bg text-high',
  medium: 'bg-medium-bg text-medium',
  low: 'bg-low-bg text-low',
}

function Cell({ value }) {
  const level = typeof value === 'string' && levelStyles[value.trim().toLowerCase()]

  if (level) {
    return (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${level}`}>
        {value}
      </span>
    )
  }

  return value
}

function Table({ title, columns, rows }) {
  return (
    <div className="flex flex-col gap-3">
      {title && (
        <h3 className="text-xs font-medium uppercase tracking-wider text-subtle">
          {title}
        </h3>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-ink pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-subtle"
                >{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="leading-relaxed text-ink-soft">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-line"
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={column.key}
                    className={`py-[18px] pr-4 align-top ${columnIndex === 0 ? 'text-ink' : ''}`}
                  >
                    <Cell value={row[column.key]} />
                  </td>
                ))}
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table

{/* thead is table head while th is a header cell!! confusing but we move */}

{/* table body breakdown get it into your skull */}
{/* go through every item in the array and create a row (tr) for each one */}
{/* td = table data cell, wish it was tada */}
{/* match column.key to row contents key to render the corresponding cell */}
