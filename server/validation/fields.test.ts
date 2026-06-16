import { describe, expect, it } from "vitest";
import {
  checklistItemsField,
  nameField,
  titleField,
} from "./fields";
import { LIMITS } from "./limits";

describe("titleField", () => {
  it("requires non-empty title", () => {
    expect(titleField.safeParse("").success).toBe(false);
  });

  it("rejects overlong titles", () => {
    expect(titleField.safeParse("x".repeat(LIMITS.title + 1)).success).toBe(
      false,
    );
  });
});

describe("nameField", () => {
  it("accepts valid names", () => {
    expect(nameField.safeParse("Project Alpha").success).toBe(true);
  });
});

describe("checklistItemsField", () => {
  it("requires at least one item", () => {
    expect(checklistItemsField.safeParse([]).success).toBe(false);
  });

  it("rejects empty item strings", () => {
    expect(checklistItemsField.safeParse([""]).success).toBe(false);
  });

  it("accepts valid items", () => {
    expect(checklistItemsField.safeParse(["Buy milk"]).success).toBe(true);
  });
});
