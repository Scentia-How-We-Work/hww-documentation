function Commercials({ content }) {
  return (
    <div>
      <h4>{content.title}</h4>
      <p>{content.timeSaving}</p>
      <p>{content.costBenefit}</p>
    </div>
  )
}

export default Commercials