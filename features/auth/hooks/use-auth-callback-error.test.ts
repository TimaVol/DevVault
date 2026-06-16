import { renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";
import { useAuthCallbackError } from "./use-auth-callback-error";

describe("useAuthCallbackError", () => {
  it("shows toast for known callback errors", () => {
    renderHook(() => useAuthCallbackError("auth_callback_failed"));

    expect(toast.error).toHaveBeenCalledWith(
      "Sign in failed. Please try again.",
    );
  });

  it("does nothing for unknown errors", () => {
    vi.clearAllMocks();
    renderHook(() => useAuthCallbackError("unknown"));

    expect(toast.error).not.toHaveBeenCalled();
  });
});
