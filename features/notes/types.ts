import type { getNotes } from "./server/queries";

export type Note = Awaited<ReturnType<typeof getNotes>>[number];
