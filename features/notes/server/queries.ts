import "server-only";

import { and, count, desc, eq } from "drizzle-orm";
import { requireDrizzle } from "@/server/auth/require-user";
import { paginatedList } from "@/server/queries/paginated-list";
import { ilikeAny, notDeleted } from "@/server/queries/filters";
import { notes } from "@/lib/db/schema";
import type { AppDbTransaction } from "@/lib/db/types";
import type { NoteListParams } from "./params";

function buildNoteFilters(params: NoteListParams) {
  const conditions = [notDeleted(notes)];

  if (params.q) {
    const pattern = `%${params.q}%`;
    conditions.push(ilikeAny(pattern, notes.title, notes.content));
  }

  return and(...conditions);
}

async function countRows(
  tx: AppDbTransaction,
  where: ReturnType<typeof buildNoteFilters>,
) {
  const [countResult] = await tx
    .select({ value: count() })
    .from(notes)
    .where(where);
  return countResult?.value ?? 0;
}

async function fetchNoteRows(
  tx: AppDbTransaction,
  where: ReturnType<typeof buildNoteFilters>,
  limit: number,
  offset: number,
) {
  return tx
    .select()
    .from(notes)
    .where(where)
    .orderBy(desc(notes.isPinned), desc(notes.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getNotes(
  params: NoteListParams = { q: undefined, note: undefined, page: 1, pageSize: 50 },
) {
  const where = buildNoteFilters(params);

  return paginatedList({
    params,
    countRows: (tx) => countRows(tx, where),
    fetchRows: (tx, limit, offset) => fetchNoteRows(tx, where, limit, offset),
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
