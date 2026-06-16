import { describe, expect, it } from "vitest";
import { parseProjectParams } from "./params";

describe("parseProjectParams", () => {
  it("defaults tab to all", () => {
    expect(parseProjectParams({})).toMatchObject({ tab: "all", page: 1 });
  });

  it("parses valid tab", () => {
    expect(parseProjectParams({ tab: "active" })).toMatchObject({
      tab: "active",
    });
  });

  it("falls back to all for invalid tab", () => {
    expect(parseProjectParams({ tab: "invalid" })).toMatchObject({
      tab: "all",
    });
  });
});
