import { projectTitle } from "../lib/projects";
import type { Project } from "../lib/types";
import ThemeToggle from "./ThemeToggle";

type Props = { projects: Project[]; missingId: string | null };

// What a project has so far, e.g. "PRD v2 · TDS v1"
function documents(project: Project) {
  return [
    project.prd.length > 0 && `PRD v${project.prd.length}`,
    project.tds.length > 0 && `TDS v${project.tds.length}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

function ProjectList({ projects, missingId }: Props) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-8 py-20">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <p className="text-sm font-medium text-accent">Documentation</p>
          <ThemeToggle />
        </div>
        <h1 className="mb-12 text-6xl font-light leading-none tracking-tighter">Projects</h1>

        {missingId && (
          <p className="mb-8 bg-medium-bg px-4 py-3 text-sm text-medium">
            No project found for "{missingId}". Choose one below.
          </p>
        )}

        <div className="flex flex-col border-t border-ink">
          {projects.map(function (project) {
            const overview = project.prd.at(-1)?.overview;

            return (
              <a
                key={project.id}
                href={`?project=${encodeURIComponent(project.id)}`}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-line py-5 transition-transform duration-200 hover:scale-[1.02]"
              >
                <span className="text-lg text-ink">{projectTitle(project)}</span>
                <span className="text-sm text-muted">
                  {overview && `${overview.team} · ${overview.targetDelivery} · `}
                  {documents(project)}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default ProjectList;
