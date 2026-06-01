import { getPgErrorMessage } from "@/utils/pg-error";
import type { AppDatabase, AppDbTransaction } from "./types";
import { applyRlsSession, resetRlsSession } from "./rls-session";

export type SupabaseToken = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  email?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  role?: string;
};

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
      ...rest: Parameters<AppDatabase["transaction"]> extends [
        infer _,
        ...infer Rest,
      ]
        ? Rest
        : never[]
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
      }, ...rest);
    },
  };
}

export type DrizzleRLSClient = ReturnType<typeof createDrizzle>;
