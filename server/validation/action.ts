import type { ZodError } from "zod";
import { actionFailure, type ActionFailure } from "@/shared/action-result";
import { parseActionId } from "@/server/validation/ids";

type ZodFailure = { success: false; error: ZodError };

export function zodFailure(result: ZodFailure): ActionFailure {
  return actionFailure(result.error.issues[0].message);
}

export function parseIdOrFail(id: string): ActionFailure | null {
  const result = parseActionId(id);
  if (!result.success) {
    return actionFailure(result.error.issues[0].message);
  }
  return null;
}
