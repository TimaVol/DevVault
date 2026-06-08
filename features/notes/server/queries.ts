import "server-only";

import { desc, isNull } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { notes } from "@/lib/db/schema";

export async function getNotes() {
  const db = await requireDrizzle();

  return db.rls((tx) =>
    tx
      .select()
      .from(notes)
      .where(isNull(notes.deletedAt))
      .orderBy(desc(notes.createdAt)),
  );
}
