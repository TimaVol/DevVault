import "server-only";

import { count, type SQL } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";
import type { AppDbTransaction } from "@/lib/db/types";

export async function countTableRows(
  tx: AppDbTransaction,
  table: AnyPgTable,
  where: SQL | undefined,
) {
  const [countResult] = await tx
    .select({ value: count() })
    .from(table)
    .where(where);

  return countResult?.value ?? 0;
}

export async function fetchTableRows<TRow>(
  tx: AppDbTransaction,
  table: AnyPgTable,
  where: SQL | undefined,
  orderBy: SQL[],
  limit: number,
  offset: number,
): Promise<TRow[]> {
  return tx
    .select()
    .from(table)
    .where(where)
    .orderBy(...orderBy)
    .limit(limit)
    .offset(offset) as Promise<TRow[]>;
}
