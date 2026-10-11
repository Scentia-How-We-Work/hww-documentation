function Nav({sections}) {
  return (
    <nav className="sticky top-0 flex h-screen w-64 flex-col gap-2 border-r border-mist-100 bg-white p-6">
      {sections.map(function (section) {
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-md px-3 py-2 text-sm text-mist-600 transition hover:bg-mist-50 hover:text-mist-900"
          >
            {section.title}
          </a>
        )
      })}
    </nav>
  )
}

export default Nav