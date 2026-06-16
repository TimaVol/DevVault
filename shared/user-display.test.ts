import { describe, expect, it } from "vitest";
import { getUserDisplayName, getUserInitial } from "./user-display";

describe("getUserInitial", () => {
  it("returns demo initial", () => {
    expect(getUserInitial("user@example.com", { isDemo: true })).toBe("D");
  });

  it("returns first letter of email", () => {
    expect(getUserInitial("alice@example.com")).toBe("A");
  });

  it("returns U when email missing", () => {
    expect(getUserInitial(null)).toBe("U");
  });
});

describe("getUserDisplayName", () => {
  it("returns Demo for demo mode", () => {
    expect(getUserDisplayName("user@example.com", { isDemo: true })).toBe(
      "Demo",
    );
  });

  it("returns local part of email", () => {
    expect(getUserDisplayName("alice@example.com")).toBe("alice");
  });

  it("returns User when email missing", () => {
    expect(getUserDisplayName(undefined)).toBe("User");
  });
});
