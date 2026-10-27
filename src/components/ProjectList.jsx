function ProjectList({ projects, missingId }) {
  return (
    <main className="min-h-screen bg-mist-50 text-mist-900">
      <div className="mx-auto max-w-3xl px-8 py-12">
        <h1 className="mb-6 text-3xl font-medium text-mist-800">
          Projects
        </h1>

        {missingId && (
          <p className="mb-6 rounded-lg border border-mist-200 bg-white px-4 py-3 text-sm text-mist-600">
            No project found for "{missingId}". Choose one below.
          </p>
        )}

        <div className="grid gap-4">
          {projects.map(function (project) {
            return (
              <a
                key={project.id}
                href={`?project=${encodeURIComponent(project.id)}`}
                className="rounded-lg border border-mist-200 bg-white p-5 transition-transform duration-200 hover:scale-[1.02]"
              >
                <p className="text-base font-medium text-mist-800">
                  {project.prd.pageTitle}
                </p>
                <p className="mt-1 text-sm text-mist-500">
                  {project.prd.overview.team} · {project.prd.overview.targetDelivery}
                </p>
              </a>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default ProjectList
