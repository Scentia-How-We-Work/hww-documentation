type Props = { title?: string; items: string[] }

function List({ title, items }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {title && (
        <h3 className="text-xs font-medium uppercase tracking-wider text-subtle">
          {title}
        </h3>
      )}

      <ol className="flex flex-col border-t border-line">
        {items.map(function (item, index) {
          return (
            <li key={index} className="flex gap-4 border-b border-line py-3.5 leading-7 text-ink-soft">
              <span className="w-6 shrink-0 text-sm leading-7 text-subtle">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default List
