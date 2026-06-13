import { getPgErrorMessage } from "@/utils/errors";
import { applyRlsSession, resetRlsSession } from "./rls-session";
import type { AppDatabase, AppDbTransaction, SupabaseToken } from "./types";

const ALLOWED_ROLES = new Set(["anon", "authenticated", "service_role"]);

function resolveRole(role: string | undefined): string {
  if (role && ALLOWED_ROLES.has(role)) {
    return role;
  }
  return "anon";
}

export function createDrizzle(
  token: SupabaseToken,
  { admin, client }: { admin: AppDatabase; client: AppDatabase },
) {
  const role = resolveRole(token.role);

  return {
    admin,
    rls: async <T>(
      transaction: (tx: AppDbTransaction) => Promise<T>,
    ): Promise<T> => {
      return client.transaction(async (tx) => {
        await applyRlsSession(tx, token, role);

        try {
          return await transaction(tx);
        } catch (err) {
          throw new Error(`RLS query failed: ${getPgErrorMessage(err)}`, {
            cause: err,
          });
        } finally {
          try {
            await resetRlsSession(tx);
          } catch {
            // Transaction may be aborted; ROLLBACK clears LOCAL role/config.
          }
        }
      });
    },
  };
}

export type DrizzleRLSClient = ReturnType<typeof createDrizzle>;
