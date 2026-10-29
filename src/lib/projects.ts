import type { DocKind, Level, Prd, Project, Tds } from "./types";

export type DocPath = { projectId: string; kind: DocKind; version: number };

/** The project, document kind and version a content file holds: projects/<id>/<prd|tds>/v<n>.json. */
export function parseDocPath(path: string): DocPath | undefined {
  const match = path.match(/projects\/([^/]+)\/(prd|tds)\/v([1-9]\d*)\.json$/);
  if (!match) return undefined;
  return { projectId: match[1], kind: match[2] as DocKind, version: Number(match[3]) };
}

/** Projects from content modules keyed by file path, each with its PRD and TDS versions. */
export function projectsFromModules(modules: Record<string, Prd | Tds>): Project[] {
  const byId = new Map<string, Project>();
  const numbers = new Map<Prd | Tds, number>();

  for (const [path, doc] of Object.entries(modules)) {
    const parsed = parseDocPath(path);
    if (!parsed) continue;
    const project = byId.get(parsed.projectId) ?? { id: parsed.projectId, prd: [], tds: [] };
    byId.set(parsed.projectId, project);
    numbers.set(doc, parsed.version);
    if (parsed.kind === "prd") project.prd.push(doc as Prd);
    else project.tds.push(doc as Tds);
  }

  const byVersion = (a: Prd | Tds, b: Prd | Tds) => numbers.get(a)! - numbers.get(b)!;
  for (const project of byId.values()) {
    project.prd.sort(byVersion);
    project.tds.sort(byVersion);
  }

  return [...byId.values()].sort((a, b) => projectTitle(a).localeCompare(projectTitle(b)));
}

/** The latest PRD's page title, or the TDS's project name when there's no PRD yet. */
export function projectTitle(project: Project): string {
  return project.prd.at(-1)?.pageTitle ?? project.tds.at(-1)!.documentControl.project;
}

// Holds the blank PRD and TDS to copy: it can be opened by its link, but isn't listed
const TEMPLATE_ID = "template";

/** The projects shown on the projects list. */
export function listedProjects(projects: Project[]): Project[] {
  return projects.filter((project) => project.id !== TEMPLATE_ID);
}

export function findProject(projects: Project[], id: string | null): Project | undefined {
  return projects.find((project) => project.id === id);
}

export type View =
  | { page: "list"; missingId: string | null }
  | { page: "doc"; project: Project; kind: DocKind; version: number; missingVersion?: string };

/**
 * What the URL asks for: ?project=<id>&doc=<prd|tds>&v=<n>. Without doc it's the PRD (or the TDS if
 * there's no PRD); without v, or with an unknown one, it's the latest version.
 */
export function resolveView(projects: Project[], params: URLSearchParams): View {
  const projectId = params.get("project");
  const project = findProject(projects, projectId);
  if (!project) return { page: "list", missingId: projectId };

  const asked = params.get("doc") === "tds" ? "tds" : "prd";
  const kind: DocKind = project[asked].length > 0 ? asked : asked === "prd" ? "tds" : "prd";
  const latest = project[kind].length;

  const v = params.get("v");
  if (v === null) return { page: "doc", project, kind, version: latest };
  const version = Number(v);
  if (Number.isInteger(version) && version >= 1 && version <= latest) {
    return { page: "doc", project, kind, version };
  }
  return { page: "doc", project, kind, version: latest, missingVersion: v };
}

/** The link to a project's document, and to one version of it when given. */
export function docHref(projectId: string, kind: DocKind, version?: number): string {
  const href = `?project=${encodeURIComponent(projectId)}&doc=${kind}`;
  return version === undefined ? href : `${href}&v=${version}`;
}

/** The level a table cell names (e.g. risk impact and likelihood), if it's Low, Medium or High. */
export function level(value: string): Level | undefined {
  const text = value.trim().toLowerCase();
  return text === "low" || text === "medium" || text === "high" ? text : undefined;
}
