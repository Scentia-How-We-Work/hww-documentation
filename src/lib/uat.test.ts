import { describe, expect, it } from "vitest";
import {
  DOC_LABELS,
  docHref,
  parseDocPath,
  projectsFromModules,
  projectTitle,
  resolveView,
  versions,
} from "./projects";
import { mermaidBlocks } from "./tds";
import type { Prd, UatGuide } from "./types";
import { validateContent } from "./validate";

// The UAT guide: an optional third document a project can have, next to its PRD and TDS

const prd = (title: string, number = 1) =>
  ({ pageTitle: `${title} PRD`, overview: { title }, version: { number } }) as Prd;
const uat = (project: string, number = 1) => ({ project, version: { number } }) as UatGuide;

describe("UAT guide paths", () => {
  it("reads a UAT guide's project and version from its path", () => {
    expect(parseDocPath("./projects/partner-packs/uat/v3.json")).toEqual({
      projectId: "partner-packs",
      kind: "uat",
      version: 3,
    });
  });

  it("links to a project's UAT guide", () => {
    expect(docHref("a", "uat")).toBe("?project=a&doc=uat");
    expect(docHref("a", "uat", 2)).toBe("?project=a&doc=uat&v=2");
  });

  it("labels each kind of document", () => {
    expect(DOC_LABELS).toEqual({ prd: "PRD", tds: "TDS", uat: "UAT guide" });
  });
});

describe("projects with a UAT guide", () => {
  const projects = projectsFromModules({
    "./projects/a/prd/v1.json": prd("A"),
    "./projects/a/uat/v2.json": uat("A", 2),
    "./projects/a/uat/v1.json": uat("A", 1),
    "./projects/b/prd/v1.json": prd("B"),
    "./projects/c/uat/v1.json": uat("C"),
  });
  const [a, b, c] = projects;
  const params = (query: string) => new URLSearchParams(query);

  it("collects a project's UAT guide versions, oldest first", () => {
    expect(a.uat).toEqual([uat("A", 1), uat("A", 2)]);
  });

  it("leaves uat off a project that has no UAT guide", () => {
    expect(b).not.toHaveProperty("uat");
  });

  it("lists a document's versions, empty when the project doesn't have it", () => {
    expect(versions(a, "uat")).toHaveLength(2);
    expect(versions(b, "uat")).toEqual([]);
    expect(versions(c, "prd")).toEqual([]);
  });

  it("names a project that only has a UAT guide after the guide's project", () => {
    expect(projectTitle(c)).toBe("C");
  });

  it("shows the latest UAT guide, or the version asked for", () => {
    expect(resolveView(projects, params("project=a&doc=uat"))).toMatchObject({
      page: "doc",
      kind: "uat",
      version: 2,
    });
    expect(resolveView(projects, params("project=a&doc=uat&v=1"))).toMatchObject({
      kind: "uat",
      version: 1,
    });
  });

  it("shows the PRD when there's no UAT guide, and the UAT guide when it's all there is", () => {
    expect(resolveView(projects, params("project=b&doc=uat"))).toMatchObject({ kind: "prd" });
    expect(resolveView(projects, params("project=c"))).toMatchObject({ kind: "uat" });
    expect(resolveView(projects, params("project=c&doc=tds"))).toMatchObject({ kind: "uat" });
  });

  it("names the missing version of a UAT guide", () => {
    expect(resolveView(projects, params("project=a&doc=uat&v=9"))).toMatchObject({
      kind: "uat",
      version: 2,
      missingVersion: "9",
    });
  });
});

const guide = (number = 1): UatGuide => ({
  version: {
    number,
    date: "2026-11-19",
    status: "Draft",
    author: "Erin Smith",
    changes: "First version",
  },
  project: "Project",
  title: "Project UAT guide",
  sections: [
    {
      number: "1",
      title: "Welcome",
      blocks: [{ type: "text", text: "Hello" }],
      subsections: [
        {
          number: "UJ-1",
          title: "A journey",
          blocks: [
            { type: "checklist", items: [{ text: "Did it work?", done: false }] },
            { type: "code", code: "First name\tLast name" },
          ],
        },
      ],
    },
  ],
});

const file = (path: string, data: unknown) => ({
  path: `src/content/projects/${path}`,
  text: JSON.stringify(data),
});

describe("validating a UAT guide", () => {
  it("accepts a valid guide, with journeys numbered freely", () => {
    expect(
      validateContent([file("a/uat/v1.json", guide(1)), file("a/uat/v2.json", guide(2))]),
    ).toEqual([]);
  });

  it("rejects unknown fields and a missing title", () => {
    const { title: _, ...untitled } = guide();
    expect(validateContent([file("a/uat/v1.json", untitled)])).toEqual([
      expect.stringMatching(/^src\/content\/projects\/a\/uat\/v1\.json › title: /),
    ]);
    expect(validateContent([file("a/uat/v1.json", { ...guide(), extra: 1 })])).toEqual([
      expect.stringMatching(/extra/),
    ]);
  });

  it("rejects a code block with no code", () => {
    const data = guide();
    data.sections[0].blocks = [{ type: "code", code: "" }];
    expect(validateContent([file("a/uat/v1.json", data)])).toEqual([
      expect.stringMatching(/ › sections\.0\.blocks\.0\.code: /),
    ]);
  });

  it("requires the version number to match the file name", () => {
    expect(validateContent([file("a/uat/v1.json", guide(2))])).toEqual([
      "src/content/projects/a/uat/v1.json › version.number: is 2 but the file is v1",
    ]);
  });

  it("rejects an empty section", () => {
    const data = guide();
    data.sections.push({ number: "2", title: "Empty", blocks: [] });
    expect(validateContent([file("a/uat/v1.json", data)])).toEqual([
      'src/content/projects/a/uat/v1.json › sections.1: is empty. Write "N/A — reason" rather than leaving it empty',
    ]);
  });

  it("requires every table row to have one cell per column", () => {
    const data = guide();
    data.sections[0].subsections![0].blocks = [
      { type: "table", columns: ["A", "B"], rows: [["1"]] },
    ];
    expect(validateContent([file("a/uat/v1.json", data)])).toEqual([
      "src/content/projects/a/uat/v1.json › sections.0.subsections.0.blocks.0.rows.0: has 1 cells but the table has 2 columns",
    ]);
  });

  it("requires a guide's versions to run from v1 with no gaps", () => {
    expect(validateContent([file("a/uat/v2.json", guide(2))])).toEqual([
      "src/content/projects/a/uat: versions must run v1, v2, v3… with no gaps (missing v1)",
    ]);
  });

  it("finds the diagrams in a UAT guide", () => {
    const data = guide();
    data.sections[0].blocks.push({ type: "mermaid", code: "flowchart LR\n a" });
    expect(mermaidBlocks(data)).toEqual([
      { field: "sections.0.blocks.1", code: "flowchart LR\n a" },
    ]);
  });
});
