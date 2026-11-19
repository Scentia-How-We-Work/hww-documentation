import type { DocKind, Level, Prd, Project, Tds, UatGuide } from "./types";

type Doc = Prd | Tds | UatGuide;

export type DocPath = { projectId: string; kind: DocKind; version: number };

/** What each kind of document is called. */
export const DOC_LABELS: Record<DocKind, string> = { prd: "PRD", tds: "TDS", uat: "UAT guide" };

/** The project, document kind and version a content file holds: projects/<id>/<prd|tds|uat>/v<n>.json. */
export function parseDocPath(path: string): DocPath | undefined {
  const match = path.match(/projects\/([^/]+)\/(prd|tds|uat)\/v([1-9]\d*)\.json$/);
  if (!match) return undefined;
  return { projectId: match[1], kind: match[2] as DocKind, version: Number(match[3]) };
}

/** Projects from content modules keyed by file path, each with its PRD, TDS and UAT guide versions. */
export function projectsFromModules(modules: Record<string, Doc>): Project[] {
  const byId = new Map<string, Project>();
  const numbers = new Map<Doc, number>();

  for (const [path, doc] of Object.entries(modules)) {
    const parsed = parseDocPath(path);
    if (!parsed) continue;
    const project = byId.get(parsed.projectId) ?? { id: parsed.projectId, prd: [], tds: [] };
    byId.set(parsed.projectId, project);
    numbers.set(doc, parsed.version);
    if (parsed.kind === "prd") project.prd.push(doc as Prd);
    else if (parsed.kind === "tds") project.tds.push(doc as Tds);
    else (project.uat ??= []).push(doc as UatGuide);
  }

  const byVersion = (a: Doc, b: Doc) => numbers.get(a)! - numbers.get(b)!;
  for (const project of byId.values()) {
    project.prd.sort(byVersion);
    project.tds.sort(byVersion);
    project.uat?.sort(byVersion);
  }

  return [...byId.values()].sort((a, b) => projectTitle(a).localeCompare(projectTitle(b)));
}

/** Every version of one of a project's documents, oldest first; empty when it doesn't have one. */
export function versions(project: Project, kind: DocKind): Doc[] {
  return project[kind] ?? [];
}

/**
 * The project's name: the latest PRD's overview title, or else the TDS's project name, or else the
 * UAT guide's.
 */
export function projectTitle(project: Project): string {
  return (
    project.prd.at(-1)?.overview.title ??
    project.tds.at(-1)?.documentControl.project ??
    project.uat!.at(-1)!.project
  );
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

const KINDS: DocKind[] = ["prd", "tds", "uat"];

/**
 * What the URL asks for: ?project=<id>&doc=<prd|tds|uat>&v=<n>. Without doc, or when the project
 * doesn't have the one asked for, it's the first the project has of the PRD, TDS and UAT guide;
 * without v, or with an unknown one, it's the latest version.
 */
export function resolveView(projects: Project[], params: URLSearchParams): View {
  const projectId = params.get("project");
  const project = findProject(projects, projectId);
  if (!project) return { page: "list", missingId: projectId };

  const asked = KINDS.find((kind) => kind === params.get("doc"));
  const has = (kind: DocKind) => versions(project, kind).length > 0;
  const kind = asked && has(asked) ? asked : KINDS.find(has)!;
  const latest = versions(project, kind).length;

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
