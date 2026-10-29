import { describe, expect, it } from "vitest";
import { parseInline } from "./inline";

describe("parseInline", () => {
  it("returns plain text as one text part", () => {
    expect(parseInline("Plain text")).toEqual([{ type: "text", text: "Plain text" }]);
  });

  it("returns no parts for an empty string", () => {
    expect(parseInline("")).toEqual([]);
  });

  it("finds bold, italic and code", () => {
    expect(parseInline("a **b** *c* `d`")).toEqual([
      { type: "text", text: "a " },
      { type: "bold", text: "b" },
      { type: "text", text: " " },
      { type: "italic", text: "c" },
      { type: "text", text: " " },
      { type: "code", text: "d" },
    ]);
  });

  it("keeps formatting characters inside code as they are", () => {
    expect(parseInline("`**not bold**`")).toEqual([{ type: "code", text: "**not bold**" }]);
  });

  it("finds links to http, https and mailto addresses", () => {
    expect(parseInline("see [Brief](https://example.com/a) and [me](mailto:a@b.co)")).toEqual([
      { type: "text", text: "see " },
      { type: "link", text: "Brief", url: "https://example.com/a" },
      { type: "text", text: " and " },
      { type: "link", text: "me", url: "mailto:a@b.co" },
    ]);
  });

  it("leaves links to any other kind of address as text", () => {
    expect(parseInline("[x](javascript:alert(1))")).toEqual([
      { type: "text", text: "[x](javascript:alert(1))" },
    ]);
  });

  it("leaves unmatched markers as text", () => {
    expect(parseInline("p95 < 500 ms * 2 and **open")).toEqual([
      { type: "text", text: "p95 < 500 ms * 2 and **open" },
    ]);
  });
});
