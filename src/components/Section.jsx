function Section({ id, title, children}) {
  return (
    <section id={id} className="prd-section">
      <h2>
        {title}
      </h2>

      {children}
    </section>
  )
}

export default Section