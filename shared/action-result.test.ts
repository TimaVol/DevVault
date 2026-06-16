import { describe, expect, it } from "vitest";
import {
  actionFailure,
  actionOk,
  actionSuccess,
  isActionFailure,
  isActionSuccess,
} from "./action-result";

describe("action-result", () => {
  it("identifies failures", () => {
    const failure = actionFailure("nope");
    expect(isActionFailure(failure)).toBe(true);
    expect(isActionSuccess(failure)).toBe(false);
  });

  it("identifies successes", () => {
    const ok = actionOk();
    expect(isActionSuccess(ok)).toBe(true);
    expect(isActionFailure(ok)).toBe(false);
  });

  it("builds success payloads", () => {
    const result = actionSuccess({ id: "123" });
    expect(result).toEqual({ success: true, id: "123" });
    expect(isActionSuccess(result)).toBe(true);
  });

  it("treats undefined as not success", () => {
    expect(isActionSuccess(undefined)).toBe(false);
  });
});
