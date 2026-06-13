import { LIMITS, MAX_PAGE } from "@/server/validation/limits";

export type PaginationMeta = {
  total: number;
  page: number;
  pageSize: number;
};

export const DEFAULT_PAGE_SIZE = 50;

export function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return Math.min(parsed, MAX_PAGE);
}

export function parseStringParam(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, LIMITS.searchQuery);
}

export function getOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

function parseBaseListParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return {
    q: parseStringParam(searchParams.q),
    page: parsePageParam(searchParams.page),
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

function parseListParams<T extends Record<string, unknown>>(
  searchParams: Record<string, string | string[] | undefined>,
  parseExtra: (
    searchParams: Record<string, string | string[] | undefined>,
  ) => T,
) {
  return {
    ...parseBaseListParams(searchParams),
    ...parseExtra(searchParams),
  };
}

export function createListParamsParser<TExtra extends Record<string, unknown>>(
  parseExtra: (
    searchParams: Record<string, string | string[] | undefined>,
  ) => TExtra,
) {
  return (
    searchParams: Record<string, string | string[] | undefined>,
  ) => parseListParams(searchParams, parseExtra);
}

export function defaultListParams<T extends Record<string, unknown>>(
  extra: T,
) {
  return {
    q: undefined,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    ...extra,
  };
}
