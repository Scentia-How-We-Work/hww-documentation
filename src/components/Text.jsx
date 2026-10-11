function Text({ title, content }) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-normal">{title}</h3>
      <p className="text-mist-600">{content}</p>
    </div>
  )
}

export default Text