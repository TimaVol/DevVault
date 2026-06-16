import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SnippetMobileCard, SnippetTableRow } from "./snippet-card";
import { makeSnippet } from "@/test/fixtures/snippet";

describe("SnippetMobileCard", () => {
  it("shows pin icon when snippet is pinned", () => {
    const snippet = makeSnippet({ isPinned: true, title: "Pinned Snippet" });
    render(
      <SnippetMobileCard
        snippet={snippet}
        copiedId={null}
        onCopy={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Pinned Snippet")).toBeInTheDocument();
  });

  it("calls onCopy when copy button clicked", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const snippet = makeSnippet();

    render(
      <SnippetMobileCard
        snippet={snippet}
        copiedId={null}
        onCopy={onCopy}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]!);
    expect(onCopy).toHaveBeenCalledWith("snippet-1", snippet.content);
  });
});

describe("SnippetTableRow", () => {
  it("shows at most three tags", () => {
    const snippet = makeSnippet({
      tags: ["one", "two", "three", "four"],
    });

    render(
      <table>
        <tbody>
          <SnippetTableRow
            snippet={snippet}
            copiedId={null}
            onCopy={vi.fn()}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(screen.getByText("three")).toBeInTheDocument();
    expect(screen.queryByText("four")).not.toBeInTheDocument();
  });
});
