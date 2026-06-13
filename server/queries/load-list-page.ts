import "server-only";

import type { PaginationMeta } from "@/server/pagination";

export type SearchParams = Record<string, string | string[] | undefined>;

export type SearchParamsPageProps = {
  searchParams: Promise<SearchParams>;
};

export async function loadPaginatedPage<TParams, TItem>(
  searchParams: Promise<SearchParams>,
  parseParams: (sp: SearchParams) => TParams,
  query: (
    params: TParams,
  ) => Promise<PaginationMeta & { items: TItem[] }>,
) {
  const filters = parseParams(await searchParams);
  const { items, total, page, pageSize } = await query(filters);

  return { filters, items, total, page, pageSize };
}
