function List({ items }) {
  return (
    <div>
      <ol>
        {items.map(function (item, index) {
          return <li key={index}>{item}</li>
        })}
      </ol>
    </div>
  )
}

export default List