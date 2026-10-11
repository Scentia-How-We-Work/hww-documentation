function Overview({ overview }) {
  return (
    <div>
      <p>
        <strong>Project Title:</strong> {overview.title}
      </p>

      <p>
        <strong>Team:</strong> {overview.team}
      </p>

      <p>
        <strong>Contributors:</strong> {overview.contributors}
      </p>

      <p>
        <strong>Key Stakeholders:</strong> {overview.stakeholders}
      </p>

      <p>
        <strong>Primary Contact:</strong> {overview.primaryContact}
      </p>

      <p>
        <strong>Target Delivery:</strong> {overview.targetDelivery}
      </p>
    </div>
  )
}

export default Overview