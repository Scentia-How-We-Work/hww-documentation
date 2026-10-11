function Commercials({ content }) {
  return (
    <div>
      <h4 className="mb-3">
        {content.title}
      </h4>

      <div className="rounded-lg border border-mist-200 bg-white px-4 py-3 text-sm text-mist-600 space-y-3">
        <p className="text-mist-600">
          {content.timeSaving}
        </p>

        <p className="text-mist-600">
          {content.costBenefit}
        </p>
      </div>
    </div>
  )
}

export default Commercials