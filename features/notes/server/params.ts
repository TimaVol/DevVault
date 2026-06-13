import {
  createListParamsParser,
  parseStringParam,
} from "@/server/pagination";
import { parseActionId } from "@/server/validation/ids";

function parseNoteId(
  value: string | string[] | undefined,
): string | undefined {
  const raw = parseStringParam(value);
  if (!raw) return undefined;
  return parseActionId(raw).success ? raw : undefined;
}

export const parseNoteParams = createListParamsParser((sp) => ({
  note: parseNoteId(sp.note),
}));

export type NoteListParams = ReturnType<typeof parseNoteParams>;
