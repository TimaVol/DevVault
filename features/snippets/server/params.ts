import {
  parseListParams,
  parseStringParam,
} from "@/server/pagination";

export type SnippetListParams = {
  q?: string;
  lang: string;
  page: number;
  pageSize: number;
};

export function parseSnippetParams(
  searchParams: Record<string, string | string[] | undefined>,
): SnippetListParams {
  return parseListParams(searchParams, (sp) => ({
    lang: parseStringParam(sp.lang) ?? "all",
  }));
}
