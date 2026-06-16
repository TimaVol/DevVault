import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RegexTool } from "./regex-tool";

describe("RegexTool", () => {
  it("finds matches in test text", async () => {
    const user = userEvent.setup();
    render(<RegexTool />);

    fireEvent.change(screen.getByPlaceholderText("Pattern…"), {
      target: { value: "\\w+" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter text strings/i), {
      target: { value: "foo bar" },
    });
    await user.click(screen.getByRole("button", { name: /find matches/i }));

    expect(screen.getByText("foo")).toBeInTheDocument();
    expect(screen.getByText("bar")).toBeInTheDocument();
  });

  it("shows error for invalid regex", async () => {
    const user = userEvent.setup();
    render(<RegexTool />);

    fireEvent.change(screen.getByPlaceholderText("Pattern…"), {
      target: { value: "[" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter text strings/i), {
      target: { value: "test" },
    });
    await user.click(screen.getByRole("button", { name: /find matches/i }));

    expect(screen.getByText(/\[ERROR\] Invalid Regex/i)).toBeInTheDocument();
  });
});
