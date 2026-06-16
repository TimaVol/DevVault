import { describe, expect, it } from "vitest";
import { parseSnippetParams } from "./params";

describe("parseSnippetParams", () => {
  it("defaults lang to all", () => {
    expect(parseSnippetParams({})).toMatchObject({ lang: "all", page: 1 });
  });

  it("parses lang filter", () => {
    expect(parseSnippetParams({ lang: "typescript" })).toMatchObject({
      lang: "typescript",
    });
  });
});
