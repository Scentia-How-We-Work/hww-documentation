import Header from './Header'

function Nav({sections, title}) {
  return (
    <nav className="sticky top-0 flex h-screen w-64 flex-col gap-2 border-r border-mist-100 bg-white p-6">

      <Header title={title} />

      <div className="mt-8 flex flex-col gap-2">
        {sections.map(function (section) {
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-md px-3 py-2 text-sm text-mist-600 transition-transform hover:bg-mist-50 hover:text-mist-900 duration-200 hover:scale-105"
            >
              {section.title}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export default Nav