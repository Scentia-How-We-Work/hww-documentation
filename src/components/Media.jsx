function Media({ images }) {
  return (
    <div className="space-y-3">
      {images.map(function (item, index) {
        return (
          <div
            key={index}
            className="overflow-hidden rounded-lg"
          >
            <img
              src={item.image}
              alt={item.alt}
              className="h-auto w-full object-contain"
            />
          </div>
        )
      })}
    </div>
  )
}

export default Media