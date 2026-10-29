import Header from './Header'
import ThemeToggle from './ThemeToggle'

type Props = { sections: { id: string; title: string }[]; title: string }

function Nav({sections, title}: Props) {
  return (
    <nav className="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-12 border-r border-line px-8 py-10">

      <div className="flex flex-col gap-4">
        <a
          href="./"
          className="text-sm text-muted underline underline-offset-4 hover:text-ink"
        >
          All projects
        </a>

        <Header title={title} />
      </div>

      <div className="flex flex-col border-b border-line">
        {sections.map(function (section, index) {
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex gap-3.5 border-t border-line py-2.5 text-sm text-muted transition-transform duration-200 hover:scale-105 hover:text-ink"
            >
              <span className="w-5 text-subtle">
                {String(index + 1).padStart(2, '0')}
              </span>
              {section.title}
            </a>
          )
        })}
      </div>

      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Nav
