import { vi } from "vitest";

export const mockRouter = {
  refresh: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

export const mockPathname = "/dashboard/snippets";

export let mockSearchParams = new URLSearchParams();

export function setMockSearchParams(
  params: Record<string, string> | URLSearchParams,
) {
  mockSearchParams =
    params instanceof URLSearchParams
      ? params
      : new URLSearchParams(params);
}

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));
