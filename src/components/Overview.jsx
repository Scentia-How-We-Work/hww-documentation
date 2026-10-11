function Overview({ overview }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-mist-200 bg-white p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mist-500">
          Project Title
        </p>
        <p className="text-base font-medium text-mist-800">
          {overview.title}
        </p>
      </div>

      <div className="rounded-lg border border-mist-200 bg-white p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mist-500">
          Team
        </p>
        <p className="text-base font-medium text-mist-800">
          {overview.team}
        </p>
      </div>

      <div className="rounded-lg border border-mist-200 bg-white p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mist-500">
          Contributors
        </p>
        <p className="text-base font-medium text-mist-800">
          {overview.contributors}
        </p>
      </div>

      <div className="rounded-lg border border-mist-200 bg-white p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mist-500">
          Key Stakeholders
        </p>
        <p className="text-base font-medium text-mist-800">
          {overview.stakeholders}
        </p>
      </div>

      <div className="rounded-lg border border-mist-200 bg-white p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mist-500">
          Primary Contact
        </p>
        <p className="text-base font-medium text-mist-800">
          {overview.primaryContact}
        </p>
      </div>

      <div className="rounded-lg border border-mist-200 bg-white p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mist-500">
          Target Delivery
        </p>
        <p className="text-base font-medium text-mist-800">
          {overview.targetDelivery}
        </p>
      </div>
    </div>
  )
}

export default Overview