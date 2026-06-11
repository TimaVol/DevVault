import "server-only";

import { and, count, desc, eq, ilike, isNull, or } from "drizzle-orm";
import { requireDrizzle } from "@/server/auth/require-user";
import type { PaginatedResult } from "@/server/pagination";
import { getOffset } from "@/server/pagination";
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
): Promise<PaginatedResult<Awaited<ReturnType<typeof fetchNoteRows>>[number]>> {
  const db = await requireDrizzle();
  const where = buildNoteFilters(params);
  const offset = getOffset(params.page, params.pageSize);

  return db.rls(async (tx) => {
    const [countResult] = await tx
      .select({ value: count() })
      .from(notes)
      .where(where);

    const items = await fetchNoteRows(tx, where, params.pageSize, offset);

    return {
      items,
      total: countResult?.value ?? 0,
      page: params.page,
      pageSize: params.pageSize,
    };
  });
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
