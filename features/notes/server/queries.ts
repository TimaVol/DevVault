import "server-only";

import { and, desc, ilike, isNull, or } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { notes } from "@/lib/db/schema";
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

export async function getNotes(params: NoteListParams = {}) {
  const db = await requireDrizzle();
  const where = buildNoteFilters(params);

  return db.rls((tx) =>
    tx.select().from(notes).where(where).orderBy(desc(notes.createdAt)),
  );
}
