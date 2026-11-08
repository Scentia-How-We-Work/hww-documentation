import type { ReactNode } from "react";

type Props = { columns: string[]; rows: ReactNode[][] };

// A table's rows for small screens, so nothing hides off the side: each row is a block led by its
// first cell, with every other cell beside its column's label
function StackedRows({ columns, rows }: Props) {
  return (
    <div className="flex flex-col border-t border-ink sm:hidden">
      {rows.map(([first, ...rest], rowIndex) => (
        <div key={rowIndex} className="flex flex-col gap-3 border-b border-line py-4 text-sm">
          <p className="sr-only">{columns[0]}</p>
          <div className="leading-relaxed text-ink">{first}</div>

          {rest.length > 0 && (
            <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-2.5">
              {rest.map((cell, index) => (
                <div key={index} className="contents">
                  <dt className="pt-0.5 text-xs font-medium uppercase tracking-wider text-subtle [overflow-wrap:anywhere]">
                    {columns[index + 1]}
                  </dt>
                  <dd className="leading-relaxed text-ink-soft [overflow-wrap:anywhere]">{cell}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      ))}
    </div>
  );
}

export default StackedRows;
