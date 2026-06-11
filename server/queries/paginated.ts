import "server-only";

import type { AppDbTransaction } from "@/lib/db/types";
import type { PaginatedResult } from "@/server/pagination";
import { getOffset } from "@/server/pagination";

type PaginatedQueryOptions<T> = {
  tx: AppDbTransaction;
  page: number;
  pageSize: number;
  getTotal: () => Promise<number>;
  getItems: (offset: number, limit: number) => Promise<T[]>;
};

export async function paginatedQuery<T>({
  tx,
  page,
  pageSize,
  getTotal,
  getItems,
}: PaginatedQueryOptions<T>): Promise<PaginatedResult<T>> {
  const offset = getOffset(page, pageSize);
  const [total, items] = await Promise.all([
    getTotal(),
    getItems(offset, pageSize),
  ]);

  return { items, total, page, pageSize };
}
