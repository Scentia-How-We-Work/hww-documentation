import { describe, expect, it } from "vitest";
import { mermaidBlocks, sectionAnchor } from "./tds";
import type { Tds } from "./types";

describe("mermaidBlocks", () => {
  it("lists every diagram with its field, from intro, sections and subsections", () => {
    const tds = {
      intro: [{ type: "mermaid", code: "flowchart LR\n a" }],
      sections: [
        {
          number: "1",
          title: "One",
          blocks: [
            { type: "text", text: "x" },
            { type: "mermaid", code: "erDiagram" },
          ],
          subsections: [
            { number: "1.1", title: "Sub", blocks: [{ type: "mermaid", code: "sequenceDiagram" }] },
          ],
        },
        { number: "2", title: "Two", blocks: [] },
      ],
    } as unknown as Tds;

    expect(mermaidBlocks(tds)).toEqual([
      { field: "intro.0", code: "flowchart LR\n a" },
      { field: "sections.0.blocks.1", code: "erDiagram" },
      { field: "sections.0.subsections.0.blocks.0", code: "sequenceDiagram" },
    ]);
  });
});

describe("sectionAnchor", () => {
  it("turns a section or subsection number into a page anchor", () => {
    expect(sectionAnchor("3")).toBe("section-3");
    expect(sectionAnchor("3.6")).toBe("section-3-6");
    expect(sectionAnchor("A")).toBe("section-a");
    expect(sectionAnchor("13.1–13.4")).toBe("section-13-1-13-4");
  });
});
