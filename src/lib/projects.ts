import type { Level, Prd, Project } from "./types";

/** Projects from PRD modules keyed by file path. The file name is the id (used in ?project=<id>). */
export function projectsFromModules(modules: Record<string, Prd>): Project[] {
  return Object.entries(modules)
    .map(([path, prd]) => ({ id: path.match(/([^/]+)\.json$/)![1], prd }))
    .sort((a, b) => a.prd.pageTitle.localeCompare(b.prd.pageTitle));
}

export function findProject(projects: Project[], id: string | null): Project | undefined {
  return projects.find((project) => project.id === id);
}

/** The level a table cell names (e.g. risk impact and likelihood), if it's Low, Medium or High. */
export function level(value: string): Level | undefined {
  const text = value.trim().toLowerCase();
  return text === "low" || text === "medium" || text === "high" ? text : undefined;
}
