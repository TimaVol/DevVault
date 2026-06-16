import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useClipboard } from "./use-clipboard";

describe("useClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows error when copying empty text", () => {
    const { result } = renderHook(() => useClipboard());

    act(() => {
      result.current.copy("");
    });

    expect(toast.error).toHaveBeenCalledWith("Nothing to copy!");
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it("copies text and tracks copied id", () => {
    const { result } = renderHook(() => useClipboard());

    act(() => {
      result.current.copy("hello", "snippet-1");
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
    expect(result.current.isCopied("snippet-1")).toBe(true);
    expect(toast.success).toHaveBeenCalledWith("Copied to clipboard");
  });

  it("clears copied id after timeout", () => {
    const { result } = renderHook(() => useClipboard(1000));

    act(() => {
      result.current.copy("hello", "snippet-1");
    });
    expect(result.current.isCopied("snippet-1")).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.isCopied("snippet-1")).toBe(false);
  });
});
