import { describe, it, expect } from "vitest";
import {calculateTotal} from "./calculateTotal"; // Adjust the path as needed

describe("calculateTotal", () => {
  it("should sum comma-separated values", () => {
    expect(calculateTotal("100, 200, 300")).toBe(600);
  });

  it("should sum newline-separated values", () => {
    expect(calculateTotal("100\n200\n300")).toBe(600);
  });

  it("should handle mixed separators (comma and newlines)", () => {
    expect(calculateTotal("100, 200\n300")).toBe(600);
  });

  it("should ignore empty strings", () => {
    expect(calculateTotal("   ")).toBe(0);
  });

  it('should skip invalid entries like "abc"', () => {
    expect(calculateTotal("100, abc, 200")).toBe(300);
  });

  it("should parse decimal numbers", () => {
    expect(calculateTotal("300.5")).toBe(300.5);
  });

  it("should handle whitespace around numbers", () => {
    expect(calculateTotal(" 100   ")).toBe(100);
  });

  it("should ignore invalid entries with mixed valid values", () => {
    expect(calculateTotal("100, abc, 200.5, xyz")).toBe(300.5);
  });

  it("should return 0 for an empty string", () => {
    expect(calculateTotal("")).toBe(0);
  });

  it("should handle a mix of commas and newlines with valid entries", () => {
    expect(calculateTotal("100\n200, 300")).toBe(600);
  });

  it("should ignore entries with only whitespace", () => {
    expect(calculateTotal("   \n  500  ")).toBe(500);
  });
});
