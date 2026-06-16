import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileText } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { ListEmptyState } from "./list-empty-state";

describe("ListEmptyState", () => {
  it("renders title and description", () => {
    render(
      <ListEmptyState
        icon={FileText}
        title="No snippets yet"
        description="Create your first snippet to get started."
      />,
    );

    expect(screen.getByText("No snippets yet")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first snippet to get started."),
    ).toBeInTheDocument();
  });

  it("renders action button when provided", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <ListEmptyState
        title="Empty"
        description="Nothing here"
        actionLabel="Add item"
        onAction={onAction}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add item/i }));
    expect(onAction).toHaveBeenCalled();
  });
});
