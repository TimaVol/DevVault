import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Base64Tool } from "./base64-tool";

describe("Base64Tool", () => {
  it("encodes plain text", async () => {
    const user = userEvent.setup();
    render(<Base64Tool />);

    fireEvent.change(screen.getByPlaceholderText(/enter plain text/i), {
      target: { value: "hello" },
    });
    await user.click(screen.getByRole("button", { name: /base64 encode/i }));

    const output = screen.getByPlaceholderText("// Result will appear here");
    expect(output).toHaveValue("aGVsbG8=");
  });

  it("decodes base64 text", async () => {
    const user = userEvent.setup();
    render(<Base64Tool />);

    fireEvent.change(screen.getByPlaceholderText(/enter plain text/i), {
      target: { value: "aGVsbG8=" },
    });
    await user.click(screen.getByRole("button", { name: /base64 decode/i }));

    const output = screen.getByPlaceholderText("// Result will appear here");
    expect(output).toHaveValue("hello");
  });
});
