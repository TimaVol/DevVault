import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAsyncAction } from "./use-async-action";
import { mockRouter } from "@/test/mocks/next-navigation";

describe("useAsyncAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets loading during run", async () => {
    let resolve!: (value: { success: true }) => void;
    const action = () =>
      new Promise<{ success: true }>((res) => {
        resolve = res;
      });

    const { result } = renderHook(() => useAsyncAction());

    act(() => {
      void result.current.run(action);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    await act(async () => {
      resolve({ success: true });
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it("shows success toast and refreshes on success", async () => {
    const { result } = renderHook(() => useAsyncAction());

    await act(async () => {
      await result.current.run(async () => ({ success: true }), {
        successMessage: "Saved",
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Saved");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("skips refresh when refresh is false", async () => {
    const { result } = renderHook(() => useAsyncAction());

    await act(async () => {
      await result.current.run(async () => ({ success: true }), {
        refresh: false,
      });
    });

    expect(mockRouter.refresh).not.toHaveBeenCalled();
  });

  it("shows error toast on failure result", async () => {
    const { result } = renderHook(() => useAsyncAction());

    await act(async () => {
      await result.current.run(async () => ({
        success: false,
        error: "Nope",
      }));
    });

    expect(toast.error).toHaveBeenCalledWith("Nope");
  });

  it("shows error toast when action throws", async () => {
    const { result } = renderHook(() => useAsyncAction());

    let output: unknown;
    await act(async () => {
      output = await result.current.run(async () => {
        throw new Error("boom");
      });
    });

    expect(output).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith("boom");
  });
});
