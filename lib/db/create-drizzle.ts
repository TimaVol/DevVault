import { getPgErrorMessage } from "@/utils/errors";
import { applyRlsSession, resetRlsSession } from "./rls-session";
import type { AppDatabase, AppDbTransaction, SupabaseToken } from "./types";

function resolveRole(role: string | undefined): "anon" | "authenticated" {
  return role === "authenticated" ? "authenticated" : "anon";
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
          console.error("[rls]", getPgErrorMessage(err));
          throw new Error("Database operation failed", { cause: err });
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
