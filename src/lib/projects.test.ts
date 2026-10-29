import { describe, expect, it } from "vitest";
import { findProject, level, projectsFromModules } from "./projects";
import type { Prd } from "./types";

const prd = (pageTitle: string) => ({ pageTitle }) as Prd;

describe("projectsFromModules", () => {
  it("uses each file name, without .json, as the project id", () => {
    const projects = projectsFromModules({ "./projects/invoice-automation.json": prd("Invoices") });
    expect(projects).toEqual([{ id: "invoice-automation", prd: prd("Invoices") }]);
  });

  it("sorts projects by page title", () => {
    const projects = projectsFromModules({
      "./projects/b.json": prd("Zebra PRD"),
      "./projects/a.json": prd("apple PRD"),
      "./projects/c.json": prd("Mango PRD"),
    });
    expect(projects.map((project) => project.id)).toEqual(["a", "c", "b"]);
  });

  it("returns no projects for no modules", () => {
    expect(projectsFromModules({})).toEqual([]);
  });
});

describe("findProject", () => {
  const projects = projectsFromModules({ "./projects/a.json": prd("A"), "./projects/b.json": prd("B") });

  it("finds the project with the given id", () => {
    expect(findProject(projects, "b")?.prd.pageTitle).toBe("B");
  });

  it("returns undefined for an unknown or missing id", () => {
    expect(findProject(projects, "nope")).toBeUndefined();
    expect(findProject(projects, null)).toBeUndefined();
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
