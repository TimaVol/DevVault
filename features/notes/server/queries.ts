import "server-only";

import { and, count, desc, eq, ilike, isNull, or } from "drizzle-orm";
import { requireDrizzle } from "@/server/auth/require-user";
import { paginatedQuery } from "@/server/queries/paginated";
import { notes } from "@/lib/db/schema";
import type { AppDbTransaction } from "@/lib/db/types";
import type { NoteListParams } from "./params";

function buildNoteFilters(params: NoteListParams) {
  const conditions = [isNull(notes.deletedAt)];

  if (params.q) {
    const pattern = `%${params.q}%`;
    conditions.push(
      or(ilike(notes.title, pattern), ilike(notes.content, pattern))!,
    );
  }

  return and(...conditions);
}

export async function getNotes(
  params: NoteListParams = { page: 1, pageSize: 50 },
) {
  const db = await requireDrizzle();
  const where = buildNoteFilters(params);

  return db.rls((tx) =>
    paginatedQuery({
      tx,
      page: params.page,
      pageSize: params.pageSize,
      getTotal: async () => {
        const [countResult] = await tx
          .select({ value: count() })
          .from(notes)
          .where(where);
        return countResult?.value ?? 0;
      },
      getItems: (offset, limit) => fetchNoteRows(tx, where, limit, offset),
    }),
  );
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

export async function getNoteById(id: string) {
  const db = await requireDrizzle();

  const [note] = await db.rls((tx) =>
    tx
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), isNull(notes.deletedAt)))
      .limit(1),
  );

  return note ?? null;
}
