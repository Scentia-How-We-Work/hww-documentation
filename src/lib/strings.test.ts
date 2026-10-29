import { describe, expect, it } from "vitest";
import { slugify } from "./strings";

describe("slugify", () => {
  it("lower-cases and joins words with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips accents and punctuation", () => {
    expect(slugify("Café & Crème, 2026!")).toBe("cafe-creme-2026");
  });

  it("trims leading and trailing separators", () => {
    expect(slugify("  --Already-Slugged--  ")).toBe("already-slugged");
  });

  it("returns an empty string when nothing is left", () => {
    expect(slugify("!!!")).toBe("");
  });
});
