import { describe, expect, it } from "vitest";
import { parseNameStatus, versionViolations } from "./versions";

const v1 = "src/content/projects/a/prd/v1.json";
const v2 = "src/content/projects/a/prd/v2.json";

describe("parseNameStatus", () => {
  it("reads git diff --name-status output, including renames", () => {
    const output = `M\t${v1}\nA\t${v2}\nR100\t${v1}\tsrc/content/projects/b/prd/v1.json\nD\tREADME.md\n`;
    expect(parseNameStatus(output)).toEqual([
      { status: "M", path: v1 },
      { status: "A", path: v2 },
      { status: "R", path: "src/content/projects/b/prd/v1.json", oldPath: v1 },
      { status: "D", path: "README.md" },
    ]);
  });

  it("returns no changes for empty output", () => {
    expect(parseNameStatus("")).toEqual([]);
  });
});

describe("versionViolations", () => {
  it("allows new versions and changes to other files", () => {
    expect(
      versionViolations([
        { status: "A", path: v2 },
        { status: "M", path: "src/App.tsx" },
        { status: "D", path: "src/content/projects/a.json" },
        { status: "R", path: v1, oldPath: "src/content/projects/a.json" },
      ]),
    ).toEqual([]);
  });

  it("rejects editing, deleting or renaming a version that's already merged", () => {
    expect(
      versionViolations([
        { status: "M", path: v1 },
        { status: "D", path: v2 },
        { status: "R", path: "src/content/projects/a/prd/v3.json", oldPath: v1 },
        { status: "T", path: v2 },
      ]),
    ).toEqual([
      `${v1} was edited. Merged versions can't change: add the change as a new version.`,
      `${v2} was deleted. Merged versions can't change: add the change as a new version.`,
      `${v1} was renamed. Merged versions can't change: add the change as a new version.`,
      `${v2} was edited. Merged versions can't change: add the change as a new version.`,
    ]);
  });

  it("allows deleting a retired project's versions, but not editing or renaming them", () => {
    const retired = "src/content/projects/example-invoice-automation/prd/v1.json";
    expect(
      versionViolations([
        { status: "D", path: retired },
        { status: "M", path: retired },
        { status: "R", path: v2, oldPath: retired },
      ]),
    ).toEqual([
      `${retired} was edited. Merged versions can't change: add the change as a new version.`,
      `${retired} was renamed. Merged versions can't change: add the change as a new version.`,
    ]);
  });
});
