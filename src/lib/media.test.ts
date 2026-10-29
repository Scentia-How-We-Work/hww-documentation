import { describe, expect, it } from "vitest";
import { isLinkCard } from "./media";

describe("isLinkCard", () => {
  it("is true for a link card", () => {
    expect(isLinkCard({ link: "https://example.com", title: "Mock-up", description: "" })).toBe(
      true,
    );
  });

  it("is false for an image", () => {
    expect(isLinkCard({ image: "/workflow.png", alt: "Workflow" })).toBe(false);
  });
});
