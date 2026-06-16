import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  ConfirmDeleteContext,
  useConfirmDelete,
  type ConfirmDeleteContextValue,
} from "./use-confirm-delete";

describe("useConfirmDelete", () => {
  it("throws outside provider", () => {
    expect(() => renderHook(() => useConfirmDelete())).toThrow(
      "useConfirmDelete must be used within ConfirmDeleteProvider",
    );
  });

  it("returns context value inside provider", () => {
    const value: ConfirmDeleteContextValue = {
      isLoading: false,
      confirmDelete: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfirmDeleteContext.Provider value={value}>
        {children}
      </ConfirmDeleteContext.Provider>
    );

    const { result } = renderHook(() => useConfirmDelete(), { wrapper });
    expect(result.current).toBe(value);
  });
});
