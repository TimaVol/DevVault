import { describe, expect, it } from "vitest";
import { parseActionId } from "./ids";

describe("parseActionId", () => {
  it("accepts valid UUIDs", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    expect(parseActionId(id).success).toBe(true);
  });

  it("rejects invalid ids", () => {
    expect(parseActionId("not-a-uuid").success).toBe(false);
    expect(parseActionId("").success).toBe(false);
  });
});
