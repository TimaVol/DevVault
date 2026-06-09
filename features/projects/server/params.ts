import {
  DEFAULT_PAGE_SIZE,
  parsePageParam,
  parseStringParam,
} from "@/lib/db/query-params";

export type ProjectListParams = {
  q?: string;
  tab: string;
  page: number;
  pageSize: number;
};

export function parseProjectParams(
  searchParams: Record<string, string | string[] | undefined>,
): ProjectListParams {
  return {
    q: parseStringParam(searchParams.q),
    tab: parseStringParam(searchParams.tab) ?? "all",
    page: parsePageParam(searchParams.page),
    pageSize: DEFAULT_PAGE_SIZE,
  };
}
