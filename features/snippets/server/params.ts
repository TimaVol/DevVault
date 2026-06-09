import {
  DEFAULT_PAGE_SIZE,
  parsePageParam,
  parseStringParam,
} from "@/lib/db/query-params";

export type SnippetListParams = {
  q?: string;
  lang: string;
  page: number;
  pageSize: number;
};

export function parseSnippetParams(
  searchParams: Record<string, string | string[] | undefined>,
): SnippetListParams {
  return {
    q: parseStringParam(searchParams.q),
    lang: parseStringParam(searchParams.lang) ?? "all",
    page: parsePageParam(searchParams.page),
    pageSize: DEFAULT_PAGE_SIZE,
  };
}
