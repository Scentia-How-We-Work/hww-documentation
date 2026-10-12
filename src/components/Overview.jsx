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
        <div>
          {overview.contributors.map(function (contributor, index) {
            return (
              <div 
              key={index}
              className="text-base font-medium text-mist-800 flex flex-wrap items-center gap-x-2"
              >
                <span>{contributor.name},  {contributor.role} - </span>
                <a
                  href={`mailto:${contributor.email}`}
                  className="text-sm text-sky-600 hover:underline"
                >
                  {contributor.email}
                </a>
              </div>
            )
          })}
        </div>

      </div>

      <div className="rounded-lg border border-mist-200 bg-white p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mist-500">
          Key Stakeholders
        </p>
        <div>
          {overview.stakeholders.map(function (stakeholder, index) {
            return (
              <div 
              key={index}
              className="text-base font-medium text-mist-800 flex flex-wrap items-center gap-x-2"
              >
                <span>{stakeholder.name},  {stakeholder.role} - </span>
                <a
                  href={`mailto:${stakeholder.email}`}
                  className="text-sm text-sky-600 hover:underline"
                >
                  {stakeholder.email}
                </a>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-lg border border-mist-200 bg-white p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mist-500">
          Primary Contact
        </p>
        <div className="text-base font-medium text-mist-800 flex flex-wrap items-center gap-x-2">
          <span>
            {overview.primaryContact.name}, {overview.primaryContact.role} - 
          </span>
          <a
            href={`mailto:${overview.primaryContact.email}`}
            className="text-sm text-sky-600 hover:underline"
          >
            {overview.primaryContact.email}
          </a>
        </div>
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