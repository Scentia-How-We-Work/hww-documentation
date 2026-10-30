import { describe, expect, it } from "vitest";
import { STANDARD_SECTIONS } from "./tds";
import type { Prd, Tds } from "./types";
import { validateContent } from "./validate";

const person = { name: "A", role: "B", email: "a@b.co" };

const version = (number = 1) => ({
  number,
  date: "2026-10-29",
  status: "Draft",
  author: "Erin Smith",
  changes: "First version",
});

const prd = (number = 1): Prd => ({
  version: version(number) as Prd["version"],
  pageTitle: "Project PRD",
  overview: {
    title: "Project",
    team: "Team",
    contributors: [person],
    stakeholders: [person],
    primaryContact: person,
    targetDelivery: "Q4",
  },
  problem: {
    headline: "H",
    currentState: "C",
    strategicAlignment: "S",
    businessCase: {
      baseline: [{ metric: "M", currentState: "C" }],
      expectedImprovement: [{ metric: "M", currentState: "C", target: "T", improvement: "I" }],
      commercialBenefit: { title: "T", timeSaving: "S", costBenefit: "C" },
    },
  },
  solution: {
    futureState: "F",
    workflows: [{ image: "/a.png", alt: "A" }],
    keyFeatures: ["K"],
    wireframes: [{ link: "https://example.com", title: "T", description: "D" }],
  },
  scope: { goals: ["G"], nonGoals: ["N"] },
  milestones: [{ target: "T", milestone: "M", description: "D" }],
  risks: [{ risk: "R", impact: "High", likelihood: "Low", mitigation: "M" }],
  dependencies: [{ dependency: "D", requirement: "R", owner: "O", status: "S" }],
  assumptions: ["A"],
});

const tds = (number = 1): Tds => ({
  version: { ...version(number), author: "Muzza Khan" } as Tds["version"],
  prdVersion: 1,
  documentControl: {
    project: "Project",
    tier: "POC",
    approver: "Matt Stejer",
    reviewers: "TBC",
    related: [{ label: "Brief", url: "https://example.com/brief" }],
  },
  sections: STANDARD_SECTIONS.map(({ number, title }) => ({
    number,
    title,
    blocks: [{ type: "text", text: "N/A — not needed" }],
  })),
});

const file = (path: string, data: unknown) => ({
  path: `src/content/projects/${path}`,
  text: JSON.stringify(data),
});

const errorsFor = (path: string, data: unknown, others = [file("a/prd/v1.json", prd())]) =>
  validateContent([...others.filter((other) => !other.path.endsWith(path)), file(path, data)]);

describe("validateContent", () => {
  it("accepts valid PRD and TDS versions", () => {
    expect(
      validateContent([
        file("a/prd/v1.json", prd(1)),
        file("a/prd/v2.json", prd(2)),
        file("a/tds/v1.json", tds(1)),
        file("b/tds/v1.json", { ...tds(1), prdVersion: undefined }),
      ]),
    ).toEqual([]);
  });

  it("accepts Mermaid diagrams, with or without a title and description, as workflows and mock-ups", () => {
    const data = prd();
    data.solution.workflows = [
      { mermaid: "flowchart LR\n a --> b", title: "Booking", description: "How booking works." },
    ];
    data.solution.wireframes = [{ mermaid: "sequenceDiagram" }];
    expect(errorsFor("a/prd/v1.json", data)).toEqual([]);
  });

  it("rejects a Mermaid diagram with no code", () => {
    const data = prd();
    data.solution.workflows = [{ mermaid: " " }];
    expect(errorsFor("a/prd/v1.json", data)).toEqual([
      expect.stringMatching(/ › solution\.workflows\.0/),
    ]);
  });

  it("rejects files outside the layout", () => {
    expect(validateContent([file("a.json", prd())])).toEqual([
      "src/content/projects/a.json: not a document file. Use projects/<id>/prd/v<n>.json or projects/<id>/tds/v<n>.json",
    ]);
  });

  it("rejects files that aren't JSON", () => {
    const errors = validateContent([{ path: "src/content/projects/a/prd/v1.json", text: "{" }]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/^src\/content\/projects\/a\/prd\/v1\.json: not valid JSON/);
  });

  it("names the field for missing, mistyped and unknown fields", () => {
    const { pageTitle: _, ...noTitle } = prd();
    expect(errorsFor("a/prd/v1.json", noTitle)).toEqual([
      expect.stringMatching(/^src\/content\/projects\/a\/prd\/v1\.json › pageTitle: /),
    ]);
    expect(errorsFor("a/prd/v1.json", { ...prd(), assumptions: "A" })).toEqual([
      expect.stringMatching(/ › assumptions: /),
    ]);
    expect(errorsFor("a/prd/v1.json", { ...prd(), extra: true })).toEqual([
      expect.stringMatching(/extra/),
    ]);
  });

  it("requires the version number to match the file name", () => {
    expect(errorsFor("a/prd/v1.json", prd(2))).toEqual([
      "src/content/projects/a/prd/v1.json › version.number: is 2 but the file is v1",
    ]);
  });

  it("requires versions to run from v1 with no gaps", () => {
    expect(validateContent([file("a/prd/v1.json", prd(1)), file("a/prd/v3.json", prd(3))])).toEqual(
      ["src/content/projects/a/prd: versions must run v1, v2, v3… with no gaps (missing v2)"],
    );
  });

  it("requires dates as YYYY-MM-DD", () => {
    const data = { ...prd(), version: { ...version(), date: "29/10/2026" } };
    expect(errorsFor("a/prd/v1.json", data)).toEqual([expect.stringMatching(/ › version\.date: /)]);
  });

  it("requires approvedBy on an approved version", () => {
    const data = { ...prd(), version: { ...version(), status: "Approved" } };
    expect(errorsFor("a/prd/v1.json", data)).toEqual([
      "src/content/projects/a/prd/v1.json › version.approvedBy: required when the status is Approved",
    ]);
  });

  it("requires the standard TDS sections in order", () => {
    const data = tds();
    [data.sections[1], data.sections[2]] = [data.sections[2], data.sections[1]];
    expect(errorsFor("a/tds/v1.json", data)).toEqual([
      'src/content/projects/a/tds/v1.json › sections.1: expected "2 Architecture drivers", found "3 Architecture (C4 model)"',
      'src/content/projects/a/tds/v1.json › sections.2: expected "3 Architecture (C4 model)", found "2 Architecture drivers"',
    ]);

    const short = { ...tds(), sections: tds().sections.slice(0, -1) };
    expect(errorsFor("a/tds/v1.json", short)).toEqual([
      'src/content/projects/a/tds/v1.json › sections: missing "C Permission matrix"',
    ]);

    const long = { ...tds(), sections: [...tds().sections, tds().sections[0]] };
    expect(errorsFor("a/tds/v1.json", long)).toEqual([
      'src/content/projects/a/tds/v1.json › sections.20: unexpected section "1 Overview"',
    ]);
  });

  it("rejects an empty TDS section", () => {
    const data = tds();
    data.sections[4] = { ...data.sections[4], blocks: [] };
    expect(errorsFor("a/tds/v1.json", data)).toEqual([
      'src/content/projects/a/tds/v1.json › sections.4: is empty. Write "N/A — reason" rather than leaving it empty',
    ]);
  });

  it("requires subsection numbers to start with their section's number", () => {
    const data = tds();
    data.sections[0].subsections = [{ number: "2.1", title: "Context", blocks: [] }];
    expect(errorsFor("a/tds/v1.json", data)).toEqual([
      'src/content/projects/a/tds/v1.json › sections.0.subsections.0.number: "2.1" should start with "1."',
    ]);
  });

  it("requires every table row to have one cell per column", () => {
    const data = tds();
    data.sections[0].blocks = [
      {
        type: "table",
        columns: ["A", "B"],
        rows: [
          ["1", "2"],
          ["1", "2", "3"],
        ],
      },
    ];
    expect(errorsFor("a/tds/v1.json", data)).toEqual([
      "src/content/projects/a/tds/v1.json › sections.0.blocks.0.rows.1: has 3 cells but the table has 2 columns",
    ]);
  });

  it("requires the PRD version a TDS names to exist", () => {
    expect(errorsFor("a/tds/v1.json", { ...tds(), prdVersion: 3 })).toEqual([
      "src/content/projects/a/tds/v1.json › prdVersion: PRD v3 doesn't exist for this project",
    ]);
  });
});
