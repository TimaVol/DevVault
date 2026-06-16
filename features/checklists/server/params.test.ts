import { describe, expect, it } from "vitest";
import { parseChecklistParams } from "./params";

describe("parseChecklistParams", () => {
  it("returns defaults", () => {
    expect(parseChecklistParams({})).toEqual({
      q: undefined,
      page: 1,
      pageSize: 50,
    });
  });

  it("parses search and page", () => {
    expect(parseChecklistParams({ q: "deploy", page: "2" })).toEqual({
      q: "deploy",
      page: 2,
      pageSize: 50,
    });
  });
});
