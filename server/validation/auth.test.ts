import { describe, expect, it } from "vitest";
import { passwordField, resetPasswordSchema } from "./auth";

describe("passwordField", () => {
  it("accepts valid passwords", () => {
    expect(passwordField.safeParse("secret12").success).toBe(true);
  });

  it("rejects short passwords", () => {
    expect(passwordField.safeParse("short1").success).toBe(false);
  });

  it("requires a letter", () => {
    expect(passwordField.safeParse("12345678").success).toBe(false);
  });

  it("requires a number", () => {
    expect(passwordField.safeParse("abcdefgh").success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("requires matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "secret12",
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
    }
  });

  it("accepts matching passwords", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "secret12",
        confirmPassword: "secret12",
      }).success,
    ).toBe(true);
  });
});
