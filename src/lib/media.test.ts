import { describe, expect, it } from "vitest";
import { isDiagram, isLinkCard, prdDiagrams } from "./media";
import type { Prd } from "./types";

describe("isLinkCard", () => {
  it("is true for a link card", () => {
    expect(isLinkCard({ link: "https://example.com", title: "Mock-up", description: "" })).toBe(
      true,
    );
  });

  it("is false for an image", () => {
    expect(isLinkCard({ image: "/workflow.png", alt: "Workflow" })).toBe(false);
  });

  it("is false for a diagram", () => {
    expect(isLinkCard({ mermaid: "flowchart LR\n a" })).toBe(false);
  });
});

describe("isDiagram", () => {
  it("is true for a Mermaid diagram", () => {
    expect(isDiagram({ mermaid: "flowchart LR\n a", title: "Booking" })).toBe(true);
  });

  it("is false for an image or a link card", () => {
    expect(isDiagram({ image: "/workflow.png", alt: "Workflow" })).toBe(false);
    expect(isDiagram({ link: "https://example.com", title: "Mock-up", description: "" })).toBe(
      false,
    );
  });
});

describe("prdDiagrams", () => {
  it("lists every diagram in workflows and wireframes with its field", () => {
    const prd = {
      solution: {
        workflows: [
          { image: "/a.png", alt: "A" },
          { mermaid: "flowchart LR\n a" },
          { mermaid: "sequenceDiagram", title: "Sign-in" },
        ],
        wireframes: [
          { link: "https://example.com", title: "T", description: "D" },
          { mermaid: "erDiagram" },
        ],
      },
    } as unknown as Prd;

    expect(prdDiagrams(prd)).toEqual([
      { field: "solution.workflows.1", code: "flowchart LR\n a" },
      { field: "solution.workflows.2", code: "sequenceDiagram" },
      { field: "solution.wireframes.1", code: "erDiagram" },
    ]);
  });
});
