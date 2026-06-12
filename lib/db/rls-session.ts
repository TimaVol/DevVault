import { sql } from "drizzle-orm";
import type { AppDbTransaction, SupabaseToken } from "./types";

/** Escape single quotes for safe use inside SQL string literals. */
function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

/** Apply Supabase RLS session vars — matches Drizzle docs (string literals, not bind params). */
export async function applyRlsSession(
  tx: AppDbTransaction,
  token: SupabaseToken,
  role: string,
) {
  const claimsJson = escapeSqlLiteral(JSON.stringify(token));
  const sub = escapeSqlLiteral(token.sub ?? "");

  await tx.execute(
    sql.raw(
      `select set_config('request.jwt.claims', '${claimsJson}', true)`,
    ),
  );
  await tx.execute(
    sql.raw(
      `select set_config('request.jwt.claim.sub', '${sub}', true)`,
    ),
  );
  await tx.execute(sql.raw(`set local role ${role}`));
}

export async function resetRlsSession(tx: AppDbTransaction) {
  await tx.execute(
    sql.raw(`select set_config('request.jwt.claims', NULL, true)`),
  );
  await tx.execute(
    sql.raw(`select set_config('request.jwt.claim.sub', NULL, true)`),
  );
  await tx.execute(sql.raw(`reset role`));
}
