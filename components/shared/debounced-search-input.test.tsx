import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DebouncedSearchInput } from "./debounced-search-input";

describe("DebouncedSearchInput", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates local value immediately", async () => {
    const user = userEvent.setup();
    render(
      <DebouncedSearchInput value="" onDebouncedChange={vi.fn()} placeholder="Search" />,
    );

    const input = screen.getByPlaceholderText("Search");
    await user.type(input, "react");

    expect(input).toHaveValue("react");
  });

  it("fires debounced callback after delay", async () => {
    const user = userEvent.setup();
    const onDebouncedChange = vi.fn();

    render(
      <DebouncedSearchInput
        value=""
        onDebouncedChange={onDebouncedChange}
        debounceMs={300}
        placeholder="Search"
      />,
    );

    await user.type(screen.getByPlaceholderText("Search"), "next");
    expect(onDebouncedChange).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(onDebouncedChange).toHaveBeenLastCalledWith("next");
  });
});
