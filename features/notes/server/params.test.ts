import { describe, expect, it } from "vitest";
import { parseNoteParams } from "./params";

describe("parseNoteParams", () => {
  it("returns undefined note by default", () => {
    expect(parseNoteParams({})).toMatchObject({ note: undefined, page: 1 });
  });

  it("parses valid note id", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    expect(parseNoteParams({ note: id })).toMatchObject({ note: id });
  });

  it("ignores invalid note id", () => {
    expect(parseNoteParams({ note: "not-uuid" })).toMatchObject({
      note: undefined,
    });
  });
});
