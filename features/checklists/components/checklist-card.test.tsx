import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChecklistCard } from "./checklist-card";
import { makeChecklist } from "@/test/fixtures/checklist";

describe("ChecklistCard", () => {
  it("shows progress percentage", () => {
    const checklist = makeChecklist();
    render(
      <ChecklistCard
        checklist={checklist}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("1/2 complete")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("calls onToggle when checkbox clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const checklist = makeChecklist();

    render(
      <ChecklistCard
        checklist={checklist}
        onToggle={onToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]!);
    expect(onToggle).toHaveBeenCalledWith("item-1", false);
  });

  it("calls onEdit and onDelete", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const checklist = makeChecklist();

    render(
      <ChecklistCard
        checklist={checklist}
        onToggle={vi.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]!);
    expect(onEdit).toHaveBeenCalledWith(checklist);

    await user.click(buttons[1]!);
    expect(onDelete).toHaveBeenCalledWith("checklist-1");
  });
});
