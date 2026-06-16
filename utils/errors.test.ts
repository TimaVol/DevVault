import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getClientErrorMessage,
  getErrorMessage,
  getPgErrorMessage,
} from "./errors";

describe("getErrorMessage", () => {
  it("returns Error message", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns string errors", () => {
    expect(getErrorMessage("oops")).toBe("oops");
  });

  it("returns message from object", () => {
    expect(getErrorMessage({ message: "from object" })).toBe("from object");
  });

  it("returns generic message for unknown values", () => {
    expect(getErrorMessage(42)).toBe("An unexpected error occurred");
  });
});

describe("getClientErrorMessage", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns detailed message in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(getClientErrorMessage(new Error("secret"))).toBe("secret");
  });

  it("hides internals in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(getClientErrorMessage(new Error("secret"))).toBe(
      "An unexpected error occurred",
    );
  });
});

describe("getPgErrorMessage", () => {
  it("formats postgres error with code", () => {
    expect(
      getPgErrorMessage({ code: "23505", message: "duplicate key" }),
    ).toBe("duplicate key (code: 23505)");
  });

  it("falls back to getErrorMessage", () => {
    expect(getPgErrorMessage("plain")).toBe("plain");
  });
});
