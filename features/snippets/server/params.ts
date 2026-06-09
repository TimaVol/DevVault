import {
  parseBaseListParams,
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
    ...parseBaseListParams(searchParams),
    lang: parseStringParam(searchParams.lang) ?? "all",
  };
}
