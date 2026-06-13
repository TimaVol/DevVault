import { createListParamsParser } from "@/server/pagination";

export const parseChecklistParams = createListParamsParser(() => ({}));

export type ChecklistListParams = ReturnType<typeof parseChecklistParams>;
