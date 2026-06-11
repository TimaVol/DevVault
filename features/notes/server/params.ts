import {
  parseBaseListParams,
  parseStringParam,
} from "@/server/pagination";

export type NoteListParams = {
  q?: string;
  note?: string;
  page: number;
  pageSize: number;
};

export function parseNoteParams(
  searchParams: Record<string, string | string[] | undefined>,
): NoteListParams {
  return {
    ...parseBaseListParams(searchParams),
    note: parseStringParam(searchParams.note),
  };
}
