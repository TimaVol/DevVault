import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ListPagination } from "./list-pagination";

describe("ListPagination", () => {
  it("renders nothing when total fits one page", () => {
    const { container } = render(
      <ListPagination page={1} pageSize={50} total={25} onPageChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows page info and navigation", () => {
    render(
      <ListPagination page={2} pageSize={50} total={120} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText("Page 2 of 3 (120 total)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });

  it("disables previous on first page and next on last page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    const { rerender } = render(
      <ListPagination page={1} pageSize={50} total={120} onPageChange={onPageChange} />,
    );

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);

    rerender(
      <ListPagination page={3} pageSize={50} total={120} onPageChange={onPageChange} />,
    );
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});
