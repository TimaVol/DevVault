import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { JsonTool } from "./json-tool";

describe("JsonTool", () => {
  it("beautifies valid JSON", async () => {
    const user = userEvent.setup();
    render(<JsonTool />);

    const input = screen.getByPlaceholderText('{ "key": "value" }');
    fireEvent.change(input, { target: { value: '{"a":1}' } });
    await user.click(screen.getByRole("button", { name: /beautify/i }));

    const output = screen.getByPlaceholderText("// Output will appear here");
    expect(output).toHaveValue('{\n  "a": 1\n}');
  });

  it("shows error for invalid JSON", async () => {
    const user = userEvent.setup();
    render(<JsonTool />);

    const input = screen.getByPlaceholderText('{ "key": "value" }');
    fireEvent.change(input, { target: { value: "{bad json" } });
    await user.click(screen.getByRole("button", { name: /beautify/i }));

    const output = screen.getByPlaceholderText(
      "// Output will appear here",
    ) as HTMLTextAreaElement;
    expect(output.value).toContain("[ERROR] Invalid JSON");
  });
});
