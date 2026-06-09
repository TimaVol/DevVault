import { parseStringParam } from "@/lib/db/query-params";

export type ChecklistListParams = {
  q?: string;
};

export function parseChecklistParams(
  searchParams: Record<string, string | string[] | undefined>,
): ChecklistListParams {
  return {
    q: parseStringParam(searchParams.q),
  };
}
