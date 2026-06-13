import "server-only";

import { requireDrizzle } from "@/server/auth/require-user";
import { getOffset, type PaginationMeta } from "@/server/pagination";
import type { AppDbTransaction } from "@/lib/db/types";

type PaginatedParams = Pick<PaginationMeta, "page" | "pageSize">;

type PaginatedListOptions<TItem> = {
  params: PaginatedParams;
  countRows: (tx: AppDbTransaction) => Promise<number>;
  fetchRows: (
    tx: AppDbTransaction,
    limit: number,
    offset: number,
  ) => Promise<TItem[]>;
};

export async function paginatedList<TItem>({
  params,
  countRows,
  fetchRows,
}: PaginatedListOptions<TItem>) {
  const db = await requireDrizzle();
  const offset = getOffset(params.page, params.pageSize);

  return db.rls(async (tx) => {
    const [total, items] = await Promise.all([
      countRows(tx),
      fetchRows(tx, params.pageSize, offset),
    ]);

    return { items, total, page: params.page, pageSize: params.pageSize };
  });
}
