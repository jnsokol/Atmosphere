import { describe, expect, it } from "vitest";
import { pearson } from "./correlation.js";

describe("pearson", () => {
  it("returns 1 for perfectly correlated series", () => {
    expect(pearson([1, 2, 3, 4], [2, 4, 6, 8])).toBeCloseTo(1, 6);
  });

  it("returns -1 for perfectly anti-correlated series", () => {
    expect(pearson([1, 2, 3, 4], [4, 3, 2, 1])).toBeCloseTo(-1, 6);
  });

  it("returns 0 for zero-variance input", () => {
    expect(pearson([1, 1, 1], [2, 4, 6])).toBe(0);
  });
});
