import { describe, expect, it } from "vitest";
import { formatDate } from "./dates";

describe("formatDate", () => {
  it("shows a YYYY-MM-DD date as DD/MM/YYYY", () => {
    expect(formatDate("2026-10-29")).toBe("29/10/2026");
    expect(formatDate("2027-01-05")).toBe("05/01/2027");
  });

  it("leaves anything else as it is", () => {
    expect(formatDate("Q4 2026")).toBe("Q4 2026");
  });
});
