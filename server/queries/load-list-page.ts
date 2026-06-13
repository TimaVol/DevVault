import "server-only";

import type { PaginationMeta } from "@/server/pagination";

export type SearchParams = Record<string, string | string[] | undefined>;

export type SearchParamsPageProps = {
  searchParams: Promise<SearchParams>;
};

export async function loadPaginatedPage<TParams, TItem, TExtra = undefined>(
  searchParams: Promise<SearchParams>,
  parseParams: (sp: SearchParams) => TParams,
  query: (
    params: TParams,
  ) => Promise<PaginationMeta & { items: TItem[] }>,
  loadExtra?: (
    params: TParams,
    result: PaginationMeta & { items: TItem[] },
  ) => Promise<TExtra>,
) {
  const filters = parseParams(await searchParams);
  const result = await query(filters);
  const { items, total, page, pageSize } = result;
  const extra = loadExtra ? await loadExtra(filters, result) : undefined;

  return { filters, items, total, page, pageSize, extra };
}
