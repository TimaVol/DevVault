import {
  parseBaseListParams,
  parseStringParam,
} from "@/server/pagination";

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
    ...parseBaseListParams(searchParams),
    tab: parseStringParam(searchParams.tab) ?? "all",
  };
}
