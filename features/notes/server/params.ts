import {
  createListParamsParser,
  parseStringParam,
} from "@/server/pagination";

export const parseNoteParams = createListParamsParser((sp) => ({
  note: parseStringParam(sp.note),
}));

export type NoteListParams = ReturnType<typeof parseNoteParams>;
