function List({ title, items }) {
  return (
    <div>
      <h3 className="mb-3 text-xl font-semibold text-mist-800">
        {title}
      </h3>

      <ol className="list-decimal space-y-2 pl-6 text-mist-600">
        {items.map(function (item, index) {
          return (
            <li key={index} className="pl-1 leading-7">
              {item}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default List