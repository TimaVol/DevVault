import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAuthCaptcha } from "./use-auth-captcha";

describe("useAuthCaptcha", () => {
  it("starts with no token", () => {
    const { result } = renderHook(() => useAuthCaptcha());
    expect(result.current.captchaToken).toBeNull();
  });

  it("sets captcha token", () => {
    const { result } = renderHook(() => useAuthCaptcha());

    act(() => {
      result.current.setCaptchaToken("token-123");
    });

    expect(result.current.captchaToken).toBe("token-123");
  });

  it("resetCaptcha clears token and increments key", () => {
    const { result } = renderHook(() => useAuthCaptcha());
    const initialKey = result.current.captchaKey;

    act(() => {
      result.current.setCaptchaToken("token-123");
      result.current.resetCaptcha();
    });

    expect(result.current.captchaToken).toBeNull();
    expect(result.current.captchaKey).toBe(initialKey + 1);
  });

  it("captchaReady is true when captcha not required", () => {
    const { result } = renderHook(() => useAuthCaptcha());
    if (!result.current.captchaRequired) {
      expect(result.current.captchaReady).toBe(true);
    }
  });
});
