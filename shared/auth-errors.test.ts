import { describe, expect, it } from "vitest";
import {
  getAuthCallbackErrorMessage,
  resolveAuthCallbackErrorKey,
} from "./auth-errors";

describe("getAuthCallbackErrorMessage", () => {
  it("returns null for missing key", () => {
    expect(getAuthCallbackErrorMessage(undefined)).toBeNull();
  });

  it("returns message for known keys", () => {
    expect(getAuthCallbackErrorMessage("auth_callback_failed")).toBe(
      "Sign in failed. Please try again.",
    );
  });

  it("returns null for unknown keys", () => {
    expect(getAuthCallbackErrorMessage("unknown_key")).toBeNull();
  });
});

describe("resolveAuthCallbackErrorKey", () => {
  it("maps otp_expired to reset_link_expired for password reset", () => {
    expect(resolveAuthCallbackErrorKey("otp_expired", null, true)).toBe(
      "reset_link_expired",
    );
  });

  it("maps otp_expired to auth_callback_failed otherwise", () => {
    expect(resolveAuthCallbackErrorKey("otp_expired", null, false)).toBe(
      "auth_callback_failed",
    );
  });

  it("maps access_denied on password reset to reset_link_invalid", () => {
    expect(resolveAuthCallbackErrorKey(null, "access_denied", true)).toBe(
      "reset_link_invalid",
    );
  });

  it("defaults to auth_callback_failed", () => {
    expect(resolveAuthCallbackErrorKey(null, null, false)).toBe(
      "auth_callback_failed",
    );
  });
});
