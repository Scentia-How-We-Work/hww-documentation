function Section({ id, title, children}) {
  return (
    <section id={id} className="py-5 scroll-mt-8 min-h-screen snap-start">
      <h2 className="mb-3 text-3xl font-medium text-mist-800">
        {title}
      </h2>
    <div className="space-y-3 text-mist-800">
      {children}
    </div>

    </section>
  )
}

export default Section