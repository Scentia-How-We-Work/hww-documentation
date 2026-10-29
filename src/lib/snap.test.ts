import { describe, expect, it } from "vitest";
import { easeInOutCubic, snapTarget } from "./snap";

describe("snapTarget", () => {
  const viewport = 800;
  const screens = [
    { start: 0, height: 800 },
    { start: 800, height: 800 },
    { start: 1600, height: 800 },
  ];

  it("snaps to the nearest section start", () => {
    expect(snapTarget(300, viewport, 1600, screens)).toBe(0);
    expect(snapTarget(500, viewport, 1600, screens)).toBe(800);
  });

  it("doesn't snap when already at a section start", () => {
    expect(snapTarget(800, viewport, 1600, screens)).toBeNull();
    expect(snapTarget(800.4, viewport, 1600, screens)).toBeNull();
  });

  describe("a section taller than the viewport", () => {
    const tall = [
      { start: 0, height: 800 },
      { start: 800, height: 2000 },
      { start: 2800, height: 800 },
    ];

    it("scrolls freely inside it", () => {
      expect(snapTarget(1500, viewport, 2800, tall)).toBeNull();
      expect(snapTarget(2000, viewport, 2800, tall)).toBeNull();
    });

    it("can snap to its bottom edge", () => {
      expect(snapTarget(2100, viewport, 2800, tall)).toBe(2000);
    });
  });

  it("never snaps past the end of the scroll area", () => {
    const shortLast = [
      { start: 0, height: 800 },
      { start: 800, height: 500 },
    ];
    expect(snapTarget(400, viewport, 500, shortLast)).toBe(500);
  });

  it("doesn't snap without sections", () => {
    expect(snapTarget(300, viewport, 1600, [])).toBeNull();
  });
});

describe("easeInOutCubic", () => {
  it("runs from 0 to 1 through the midpoint", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
  });

  it("starts and ends slowly", () => {
    expect(easeInOutCubic(0.1)).toBeLessThan(0.1);
    expect(easeInOutCubic(0.9)).toBeGreaterThan(0.9);
  });

  it("clamps progress outside 0 to 1", () => {
    expect(easeInOutCubic(-1)).toBe(0);
    expect(easeInOutCubic(2)).toBe(1);
  });
});
