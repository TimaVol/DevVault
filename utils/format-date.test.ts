import { describe, expect, it } from "vitest";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("formats Date instances", () => {
    const result = formatDate(new Date("2024-06-15T12:00:00Z"));
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/Jun|15/);
  });

  it("formats ISO date strings", () => {
    const result = formatDate("2024-06-15T12:00:00Z");
    expect(result).toMatch(/2024/);
  });
});
