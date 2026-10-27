function ProjectList({ projects, missingId }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-8 py-20">
        <p className="mb-5 text-sm font-medium text-accent">PRDs</p>
        <h1 className="mb-12 text-6xl font-light leading-none tracking-tighter">
          Projects
        </h1>

        {missingId && (
          <p className="mb-8 bg-medium-bg px-4 py-3 text-sm text-medium">
            No project found for "{missingId}". Choose one below.
          </p>
        )}

        <div className="flex flex-col border-t border-ink">
          {projects.map(function (project) {
            return (
              <a
                key={project.id}
                href={`?project=${encodeURIComponent(project.id)}`}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-line py-5 transition-transform duration-200 hover:scale-[1.02]"
              >
                <span className="text-lg text-ink">
                  {project.prd.pageTitle}
                </span>
                <span className="text-sm text-muted">
                  {project.prd.overview.team} · {project.prd.overview.targetDelivery}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default ProjectList
