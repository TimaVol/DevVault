import { parseListParams } from "@/server/pagination";

export type ChecklistListParams = {
  q?: string;
  page: number;
  pageSize: number;
};

export function parseChecklistParams(
  searchParams: Record<string, string | string[] | undefined>,
): ChecklistListParams {
  return parseListParams(searchParams, () => ({}));
}
