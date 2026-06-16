import { describe, expect, it } from "vitest";
import { normalizeList, parseCommaList } from "./normalize-list";

describe("normalizeList", () => {
  it("trims whitespace", () => {
    expect(normalizeList(["  foo  ", "bar"])).toEqual(["foo", "bar"]);
  });

  it("drops empty strings", () => {
    expect(normalizeList(["", "  ", "foo"])).toEqual(["foo"]);
  });

  it("dedupes case-insensitively preserving first casing", () => {
    expect(normalizeList(["React", "react", "REACT", "Vue"])).toEqual([
      "React",
      "Vue",
    ]);
  });
});

describe("parseCommaList", () => {
  it("splits and normalizes comma-separated values", () => {
    expect(parseCommaList(" react, vue ,react ")).toEqual(["react", "vue"]);
  });
});
