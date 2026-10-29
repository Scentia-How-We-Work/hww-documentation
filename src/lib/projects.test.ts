import { describe, expect, it } from "vitest";
import {
  docHref,
  findProject,
  listedProjects,
  level,
  parseDocPath,
  projectsFromModules,
  projectTitle,
  resolveView,
} from "./projects";
import type { Prd, Tds } from "./types";

const prd = (pageTitle: string, number = 1) => ({ pageTitle, version: { number } }) as Prd;
const tds = (project: string, number = 1) =>
  ({ documentControl: { project }, version: { number } }) as Tds;

describe("parseDocPath", () => {
  it("reads the project id, document kind and version from the path", () => {
    expect(parseDocPath("./projects/partner-packs/tds/v2.json")).toEqual({
      projectId: "partner-packs",
      kind: "tds",
      version: 2,
    });
    expect(parseDocPath("src/content/projects/a/prd/v12.json")).toEqual({
      projectId: "a",
      kind: "prd",
      version: 12,
    });
  });

  it("returns undefined for anything outside the layout", () => {
    expect(parseDocPath("./projects/a.json")).toBeUndefined();
    expect(parseDocPath("./projects/a/brief/v1.json")).toBeUndefined();
    expect(parseDocPath("./projects/a/prd/1.json")).toBeUndefined();
    expect(parseDocPath("./projects/a/prd/v0.json")).toBeUndefined();
    expect(parseDocPath("./projects/a/prd/v01.json")).toBeUndefined();
    expect(parseDocPath("./projects/a/b/prd/v1.json")).toBeUndefined();
  });
});

describe("projectsFromModules", () => {
  it("groups each project's PRD and TDS versions, oldest first", () => {
    const projects = projectsFromModules({
      "./projects/a/prd/v10.json": prd("A", 10),
      "./projects/a/prd/v2.json": prd("A", 2),
      "./projects/a/tds/v1.json": tds("A", 1),
    });
    expect(projects).toEqual([{ id: "a", prd: [prd("A", 2), prd("A", 10)], tds: [tds("A", 1)] }]);
  });

  it("allows a project with only a PRD or only a TDS", () => {
    const projects = projectsFromModules({
      "./projects/a/prd/v1.json": prd("A"),
      "./projects/b/tds/v1.json": tds("B"),
    });
    expect(projects).toEqual([
      { id: "a", prd: [prd("A")], tds: [] },
      { id: "b", prd: [], tds: [tds("B")] },
    ]);
  });

  it("sorts projects by title", () => {
    const projects = projectsFromModules({
      "./projects/b/prd/v1.json": prd("Zebra PRD"),
      "./projects/a/prd/v1.json": prd("apple PRD"),
      "./projects/c/tds/v1.json": tds("Mango"),
    });
    expect(projects.map((project) => project.id)).toEqual(["a", "c", "b"]);
  });

  it("ignores files outside the layout and returns no projects for no modules", () => {
    expect(projectsFromModules({ "./projects/a.json": prd("A") })).toEqual([]);
    expect(projectsFromModules({})).toEqual([]);
  });
});

describe("projectTitle", () => {
  it("uses the latest PRD's page title, or the TDS project name when there's no PRD", () => {
    expect(projectTitle({ id: "a", prd: [prd("Old"), prd("New", 2)], tds: [tds("T")] })).toBe(
      "New",
    );
    expect(projectTitle({ id: "a", prd: [], tds: [tds("T")] })).toBe("T");
  });
});

describe("findProject", () => {
  const projects = projectsFromModules({
    "./projects/a/prd/v1.json": prd("A"),
    "./projects/b/prd/v1.json": prd("B"),
  });

  it("finds the project with the given id", () => {
    expect(findProject(projects, "b")?.prd[0].pageTitle).toBe("B");
  });

  it("returns undefined for an unknown or missing id", () => {
    expect(findProject(projects, "nope")).toBeUndefined();
    expect(findProject(projects, null)).toBeUndefined();
  });
});

describe("resolveView", () => {
  const projects = projectsFromModules({
    "./projects/both/prd/v1.json": prd("Both", 1),
    "./projects/both/prd/v2.json": prd("Both", 2),
    "./projects/both/tds/v1.json": tds("Both", 1),
    "./projects/tds-only/tds/v1.json": tds("T", 1),
  });
  const params = (query: string) => new URLSearchParams(query);

  it("shows the project list when no project or an unknown one is asked for", () => {
    expect(resolveView(projects, params(""))).toEqual({ page: "list", missingId: null });
    expect(resolveView(projects, params("project=nope"))).toEqual({
      page: "list",
      missingId: "nope",
    });
  });

  it("shows the latest PRD by default", () => {
    expect(resolveView(projects, params("project=both"))).toMatchObject({
      page: "doc",
      kind: "prd",
      version: 2,
    });
  });

  it("shows the TDS when there's no PRD or when asked for", () => {
    expect(resolveView(projects, params("project=tds-only"))).toMatchObject({
      kind: "tds",
      version: 1,
    });
    expect(resolveView(projects, params("project=both&doc=tds"))).toMatchObject({
      kind: "tds",
      version: 1,
    });
  });

  it("falls back to the other document when the one asked for doesn't exist", () => {
    expect(resolveView(projects, params("project=tds-only&doc=prd"))).toMatchObject({
      kind: "tds",
    });
  });

  it("shows the version asked for", () => {
    expect(resolveView(projects, params("project=both&v=1"))).toMatchObject({
      kind: "prd",
      version: 1,
    });
  });

  it("shows the latest version and names the missing one for an unknown version", () => {
    expect(resolveView(projects, params("project=both&v=7"))).toMatchObject({
      version: 2,
      missingVersion: "7",
    });
  });
});

describe("docHref", () => {
  it("links to a project's document, and to a version when given", () => {
    expect(docHref("a b", "tds")).toBe("?project=a%20b&doc=tds");
    expect(docHref("a", "prd", 3)).toBe("?project=a&doc=prd&v=3");
  });
});

describe("level", () => {
  it("recognises Low, Medium and High in any case, ignoring surrounding spaces", () => {
    expect(level("High")).toBe("high");
    expect(level(" medium ")).toBe("medium");
    expect(level("LOW")).toBe("low");
  });

  it("returns undefined for any other text", () => {
    expect(level("Highly likely")).toBeUndefined();
    expect(level("")).toBeUndefined();
  });
});

describe("listedProjects", () => {
  it("leaves the template off the projects list", () => {
    const projects = projectsFromModules({
      "./projects/template/prd/v1.json": prd("[Project Title] PRD v.1"),
      "./projects/a/prd/v1.json": prd("A"),
    });
    expect(listedProjects(projects).map((project) => project.id)).toEqual(["a"]);
  });
});
