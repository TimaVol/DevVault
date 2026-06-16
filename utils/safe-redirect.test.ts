import { describe, expect, it } from "vitest";
import { safeRelativePath } from "./safe-redirect";

describe("safeRelativePath", () => {
  const fallback = "/dashboard";

  it("returns fallback for nullish input", () => {
    expect(safeRelativePath(null, fallback)).toBe(fallback);
    expect(safeRelativePath(undefined, fallback)).toBe(fallback);
    expect(safeRelativePath("", fallback)).toBe(fallback);
  });

  it("allows same-origin relative paths", () => {
    expect(safeRelativePath("/dashboard/snippets", fallback)).toBe(
      "/dashboard/snippets",
    );
  });

  it("blocks protocol-relative paths", () => {
    expect(safeRelativePath("//evil.com", fallback)).toBe(fallback);
    expect(safeRelativePath("  //evil.com", fallback)).toBe(fallback);
  });

  it("blocks paths without leading slash", () => {
    expect(safeRelativePath("evil.com", fallback)).toBe(fallback);
  });

  it("blocks @ and backslash injection", () => {
    expect(safeRelativePath("/user@evil.com", fallback)).toBe(fallback);
    expect(safeRelativePath("/path\\evil", fallback)).toBe(fallback);
  });

  it("blocks decoded open-redirect vectors", () => {
    expect(safeRelativePath("/%2F%2Fevil.com", fallback)).toBe(fallback);
    expect(safeRelativePath("/%40evil", fallback)).toBe(fallback);
  });

  it("returns fallback for malformed percent-encoding", () => {
    expect(safeRelativePath("/%ZZ", fallback)).toBe(fallback);
  });
});
