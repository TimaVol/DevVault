import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseIdOrFail, zodFailure } from "./action";

describe("zodFailure", () => {
  it("returns first issue message", () => {
    const schema = z.object({ name: z.string().min(1, "Name is required") });
    const result = schema.safeParse({ name: "" });
    if (result.success) throw new Error("expected failure");

    expect(zodFailure(result)).toEqual({
      success: false,
      error: "Name is required",
    });
  });
});

describe("parseIdOrFail", () => {
  it("returns null for valid id", () => {
    expect(
      parseIdOrFail("550e8400-e29b-41d4-a716-446655440000"),
    ).toBeNull();
  });

  it("returns failure for invalid id", () => {
    const result = parseIdOrFail("bad-id");
    expect(result).toEqual({ success: false, error: "Invalid id" });
  });
});
