import { describe, expect, it } from "vitest";
import {
  createListParamsParser,
  DEFAULT_PAGE_SIZE,
  getOffset,
  parsePageParam,
  parseStringParam,
} from "./pagination";
import { MAX_PAGE } from "./validation/limits";

describe("parsePageParam", () => {
  it("defaults to 1", () => {
    expect(parsePageParam(undefined)).toBe(1);
  });

  it("parses valid page numbers", () => {
    expect(parsePageParam("3")).toBe(3);
  });

  it("clamps invalid values to 1", () => {
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("-1")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
  });

  it("caps at MAX_PAGE", () => {
    expect(parsePageParam(String(MAX_PAGE + 100))).toBe(MAX_PAGE);
  });

  it("uses first value from array", () => {
    expect(parsePageParam(["5", "9"])).toBe(5);
  });
});

describe("parseStringParam", () => {
  it("returns undefined for empty input", () => {
    expect(parseStringParam(undefined)).toBeUndefined();
    expect(parseStringParam("   ")).toBeUndefined();
  });

  it("trims and returns value", () => {
    expect(parseStringParam("  hello  ")).toBe("hello");
  });
});

describe("getOffset", () => {
  it("computes offset from page and page size", () => {
    expect(getOffset(3, 50)).toBe(100);
  });
});

describe("createListParamsParser", () => {
  const parse = createListParamsParser(() => ({ lang: "all" }));

  it("merges base and extra params", () => {
    expect(parse({ q: "test", page: "2" })).toEqual({
      q: "test",
      page: 2,
      pageSize: DEFAULT_PAGE_SIZE,
      lang: "all",
    });
  });
});
