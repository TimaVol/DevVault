import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UrlTool } from "./url-tool";

describe("UrlTool", () => {
  it("encodes special characters", async () => {
    const user = userEvent.setup();
    render(<UrlTool />);

    fireEvent.change(screen.getByPlaceholderText(/enter url queries/i), {
      target: { value: "hello world" },
    });
    await user.click(screen.getByRole("button", { name: /url encode/i }));

    const output = screen.getByPlaceholderText("// Result will appear here");
    expect(output).toHaveValue("hello%20world");
  });

  it("decodes encoded text", async () => {
    const user = userEvent.setup();
    render(<UrlTool />);

    fireEvent.change(screen.getByPlaceholderText(/enter url queries/i), {
      target: { value: "hello%20world" },
    });
    await user.click(screen.getByRole("button", { name: /url decode/i }));

    const output = screen.getByPlaceholderText("// Result will appear here");
    expect(output).toHaveValue("hello world");
  });
});
