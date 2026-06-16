import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import "./test/mocks/next-navigation";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});
