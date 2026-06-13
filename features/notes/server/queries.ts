import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { requireDrizzle } from "@/server/auth/require-user";
import { paginatedList } from "@/server/queries/paginated-list";
import { notDeleted, textSearchCondition } from "@/server/queries/filters";
import {
  countTableRows,
  fetchTableRows,
} from "@/server/queries/simple-table-list";
import { defaultListParams } from "@/server/pagination";
import { notes } from "@/lib/db/schema";
import type { NoteListParams } from "./params";

function buildNoteFilters(params: NoteListParams) {
  const conditions = [notDeleted(notes)];

  const textSearch = textSearchCondition(params.q, notes.title, notes.content);
  if (textSearch) {
    conditions.push(textSearch);
  }

  return and(...conditions);
}

export async function getNotes(
  params: NoteListParams = defaultListParams({ note: undefined }),
) {
  const where = buildNoteFilters(params);

  return paginatedList<typeof notes.$inferSelect>({
    params,
    countRows: (tx) => countTableRows(tx, notes, where),
    fetchRows: (tx, limit, offset) =>
      fetchTableRows<typeof notes.$inferSelect>(
        tx,
        notes,
        where,
        [desc(notes.isPinned), desc(notes.createdAt)],
        limit,
        offset,
      ),
  });
}

export async function getNoteById(id: string) {
  const db = await requireDrizzle();

  const [note] = await db.rls((tx) =>
    tx
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), notDeleted(notes)))
      .limit(1),
  );

  return note ?? null;
}
