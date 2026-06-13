export type ListParams = {
  q?: string
  page?: number
  pageSize?: number
}

export type PaginationMeta = {
  total: number
  page: number
  pageSize: number
}

export type PaginatedResult<T> = PaginationMeta & {
  items: T[]
}

export const DEFAULT_PAGE_SIZE = 50

export function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number.parseInt(raw ?? '1', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export function parseStringParam(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  return raw?.trim() || undefined
}

export function getOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize
}

export function parseBaseListParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return {
    q: parseStringParam(searchParams.q),
    page: parsePageParam(searchParams.page),
    pageSize: DEFAULT_PAGE_SIZE,
  }
}

export function parseListParams<T extends Record<string, unknown>>(
  searchParams: Record<string, string | string[] | undefined>,
  parseExtra: (
    searchParams: Record<string, string | string[] | undefined>,
  ) => T,
) {
  return {
    ...parseBaseListParams(searchParams),
    ...parseExtra(searchParams),
  }
}

export type BaseListParams = ReturnType<typeof parseBaseListParams>

export function createListParamsParser<TExtra extends Record<string, unknown>>(
  parseExtra: (
    searchParams: Record<string, string | string[] | undefined>,
  ) => TExtra,
) {
  return (
    searchParams: Record<string, string | string[] | undefined>,
  ): BaseListParams & TExtra => parseListParams(searchParams, parseExtra)
}
