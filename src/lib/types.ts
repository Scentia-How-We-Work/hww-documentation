// The shapes of the PRD and TDS files in src/content/projects/<id>/{prd,tds}/v<n>.json (see the
// template project). schemas.ts validates files against these.

export type Status = "Draft" | "In review" | "Approved" | "Superseded";

// Every PRD and TDS file starts with this. Files never change once merged, so the approval log is
// the list of every version's header.
export type VersionInfo = {
  number: number;
  date: string; // YYYY-MM-DD
  status: Status;
  author: string;
  approvedBy?: string;
  changes: string;
};

export type Person = { name: string; role: string; email: string };

export type Image = { image: string; alt: string };

// A card linking out to a page, such as a live mock-up, shown in place of an image
export type LinkCard = { link: string; title: string; description: string };

// A Mermaid diagram, such as a workflow, drawn in the page
export type Diagram = { mermaid: string; title?: string };

export type MediaItem = Image | LinkCard | Diagram;

export type Prd = {
  version: VersionInfo;
  pageTitle: string;
  overview: {
    title: string;
    team: string;
    contributors: Person[];
    stakeholders: Person[];
    primaryContact: Person;
    targetDelivery: string;
  };
  problem: {
    headline: string;
    currentState: string;
    strategicAlignment: string;
    businessCase: {
      baseline: { metric: string; currentState: string }[];
      expectedImprovement: {
        metric: string;
        currentState: string;
        target: string;
        improvement: string;
      }[];
      commercialBenefit: { title: string; timeSaving: string; costBenefit: string };
    };
  };
  solution: {
    futureState: string;
    workflows: MediaItem[];
    keyFeatures: string[];
    wireframes: MediaItem[];
  };
  scope: { goals: string[]; nonGoals: string[] };
  milestones: { target: string; milestone: string; description: string }[];
  risks: { risk: string; impact: string; likelihood: string; mitigation: string }[];
  dependencies: { dependency: string; requirement: string; owner: string; status: string }[];
  assumptions: string[];
};

// TDS content is a fixed list of sections (tds.ts) built from these blocks. Text in any block can
// use **bold**, *italic*, `code` and [links](https://…).
export type Block =
  | { type: "text"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "mermaid"; title?: string; code: string }
  | { type: "callout"; tone: "info" | "guidance" | "warning"; text: string }
  | { type: "checklist"; items: { text: string; done: boolean }[] };

export type Subsection = { number: string; title: string; blocks: Block[] };

export type TdsSection = {
  number: string;
  title: string;
  blocks: Block[];
  subsections?: Subsection[];
};

export type Tds = {
  version: VersionInfo;
  prdVersion?: number; // the PRD version this TDS was written against
  documentControl: {
    project: string;
    tier: string;
    approver: string;
    reviewers: string;
    related: { label: string; url: string }[];
  };
  intro?: Block[];
  sections: TdsSection[];
};

export type DocKind = "prd" | "tds";

// Each list holds every version of the document, oldest first; empty when there isn't one yet
export type Project = { id: string; prd: Prd[]; tds: Tds[] };

export type Level = "low" | "medium" | "high";
