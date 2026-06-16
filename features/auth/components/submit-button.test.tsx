import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SubmitButton } from "./submit-button";

const mockUseFormStatus = vi.fn(() => ({ pending: false }));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    useFormStatus: () => mockUseFormStatus(),
  };
});

describe("SubmitButton", () => {
  it("renders sign in label by default", () => {
    render(<SubmitButton />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeEnabled();
  });

  it("renders custom label", () => {
    render(<SubmitButton label="Create account" />);
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("disables when pending", () => {
    mockUseFormStatus.mockReturnValue({ pending: true });
    render(<SubmitButton />);
    expect(screen.getByRole("button")).toBeDisabled();
    mockUseFormStatus.mockReturnValue({ pending: false });
  });

  it("disables when disabled prop is true", () => {
    render(<SubmitButton disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
