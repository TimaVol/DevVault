import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useUrlFilters } from "./use-url-filters";
import {
  mockRouter,
  setMockSearchParams,
} from "@/test/mocks/next-navigation";

describe("useUrlFilters", () => {
  const defaults = { q: "", lang: "all", page: "1" };

  beforeEach(() => {
    setMockSearchParams({});
    mockRouter.replace.mockClear();
  });

  it("reads filters from search params", () => {
    setMockSearchParams({ q: "react", lang: "typescript" });

    const { result } = renderHook(() => useUrlFilters({ defaults }));
    const [filters] = result.current;

    expect(filters).toEqual({ q: "react", lang: "typescript", page: "1" });
  });

  it("setFilter removes default values from url", () => {
    const { result } = renderHook(() => useUrlFilters({ defaults }));

    act(() => {
      result.current[1]("lang", "typescript");
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(
      "/dashboard/snippets?lang=typescript",
      { scroll: false },
    );
  });

  it("setFilter with resetPage clears page param", () => {
    setMockSearchParams({ page: "3", q: "test" });
    const { result } = renderHook(() => useUrlFilters({ defaults }));

    act(() => {
      result.current[1]("q", "next", { resetPage: true });
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(
      "/dashboard/snippets?q=next",
      { scroll: false },
    );
  });
});
