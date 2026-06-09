import {
  isUnauthorized,
  requireDrizzleAction,
} from "@/lib/auth/require-user";
import type { ActionFailure, ActionResult } from "@/lib/action-result";
import {
  actionFailure,
  actionOk,
  actionSuccess,
} from "@/lib/action-result.server";
import type { DrizzleSupabaseContext } from "@/lib/db/server";
import { getErrorMessage } from "@/utils/errors";

export type {
  ActionFailure,
  ActionResult,
  ActionSuccess,
} from "@/lib/action-result";
export {
  isActionFailure,
  isActionSuccess,
} from "@/lib/action-result";

/** @deprecated Use ActionFailure */
export type ActionError = ActionFailure;

/** Columns managed by the server, omitted from drizzle-zod insert/update schemas. */
export const serverFields = {
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

export { actionFailure, actionOk, actionSuccess };

/**
 * Resolves the authenticated Drizzle context, short-circuits with an error
 * result when unauthorized, and converts thrown errors into a consistent
 * failure shape. Keeps each server action focused on its own query logic.
 */
export async function withAuthedAction<
  T extends Record<string, unknown> | void = void,
>(
  fn: (ctx: DrizzleSupabaseContext) => Promise<ActionResult<T>>,
): Promise<ActionResult<T>> {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }
  try {
    return await fn(ctx);
  } catch (err: unknown) {
    return actionFailure(getErrorMessage(err));
  }
}
