import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { JwtTool } from "./jwt-tool";

const validJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ.signature";

describe("JwtTool", () => {
  it("decodes valid JWT", async () => {
    const user = userEvent.setup();
    render(<JwtTool />);

    await user.type(
      screen.getByPlaceholderText(/eyJhbGci/i),
      validJwt,
    );
    await user.click(screen.getByRole("button", { name: /decode token/i }));

    const payload = screen.getByPlaceholderText(
      /decoded jwt payload claims/i,
    );
    expect(payload).toHaveValue('{\n  "sub": "123"\n}');
  });

  it("rejects JWT with wrong part count", async () => {
    const user = userEvent.setup();
    render(<JwtTool />);

    await user.type(
      screen.getByPlaceholderText(/eyJhbGci/i),
      "only.two",
    );
    await user.click(screen.getByRole("button", { name: /decode token/i }));

    const payload = screen.getByPlaceholderText(
      /decoded jwt payload claims/i,
    );
    expect(payload).toHaveValue("[ERROR] Invalid JWT format");
  });
});
