function Media({ title, images }) {
  return (
    <div className="flex flex-col gap-3">
      {title && (
        <h3 className="text-xs font-medium uppercase tracking-wider text-subtle">
          {title}
        </h3>
      )}

      <div className="flex flex-col gap-6">
        {images.map(function (item, index) {
          return (
            <div
              key={index}
              className="overflow-hidden border border-line"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="block h-auto w-full"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Media
