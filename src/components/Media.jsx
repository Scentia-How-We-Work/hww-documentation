function Media({ images }) {
  return (
    <div>
      {images.map(function (item, index) {
        return (
          <img
            key={index}
            src={item.image}
            alt={item.alt}
          />
        )
      })}
    </div>
  )
}

export default Media