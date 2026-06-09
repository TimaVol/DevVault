import type { getChecklists } from "./server/queries";

export type Checklist = Awaited<ReturnType<typeof getChecklists>>["items"][number];
export type ChecklistItem = Checklist["items"][number];
