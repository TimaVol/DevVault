import {
  isUnauthorized,
  requireDrizzleAction,
} from "@/lib/auth/require-user";
import type { DrizzleSupabaseContext } from "@/lib/db/server";
import { getErrorMessage } from "@/utils/errors";

/** Columns managed by the server, omitted from drizzle-zod insert/update schemas. */
export const serverFields = {
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

export type ActionError = { success: false; error: string };

/**
 * Resolves the authenticated Drizzle context, short-circuits with an error
 * result when unauthorized, and converts thrown errors into a consistent
 * failure shape. Keeps each server action focused on its own query logic.
 */
export async function withAuthedAction<T>(
  fn: (ctx: DrizzleSupabaseContext) => Promise<T>,
): Promise<T | ActionError> {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }
  try {
    return await fn(ctx);
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
