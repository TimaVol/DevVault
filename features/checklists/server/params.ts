import { parseBaseListParams } from "@/lib/db/query-params";

export type ChecklistListParams = {
  q?: string;
  page: number;
  pageSize: number;
};

export function parseChecklistParams(
  searchParams: Record<string, string | string[] | undefined>,
): ChecklistListParams {
  return parseBaseListParams(searchParams);
}
