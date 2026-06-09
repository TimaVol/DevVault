import { parseStringParam } from "@/lib/db/query-params";

export type NoteListParams = {
  q?: string;
};

export function parseNoteParams(
  searchParams: Record<string, string | string[] | undefined>,
): NoteListParams {
  return {
    q: parseStringParam(searchParams.q),
  };
}
