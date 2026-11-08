import { describe, expect, it } from "vitest";
import { diagramMinWidth } from "./diagram";

describe("diagramMinWidth", () => {
  it("is 70% of the width Mermaid gives the diagram", () => {
    expect(
      diagramMinWidth('<svg width="100%" style="max-width: 1200px;" viewBox="0 0 1200 800">'),
    ).toBe(840);
  });

  it("reads decimal widths and rounds", () => {
    expect(diagramMinWidth('<svg style="max-width: 333.5px; background-color: white;">')).toBe(233);
  });

  it("is null when the width isn't known", () => {
    expect(diagramMinWidth('<svg width="100%">')).toBeNull();
    expect(diagramMinWidth("")).toBeNull();
  });
});
