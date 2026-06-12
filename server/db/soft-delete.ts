import { eq } from "drizzle-orm";
import type { AppDbTransaction } from "@/lib/db/types";
import { checklists, notes, projects, snippets } from "@/lib/db/schema";

type SoftDeletableTable =
  | typeof notes
  | typeof projects
  | typeof snippets
  | typeof checklists;

export async function softDelete(
  tx: AppDbTransaction,
  table: SoftDeletableTable,
  id: string,
) {
  const [deleted] = await tx
    .update(table)
    .set({ deletedAt: new Date() })
    .where(eq(table.id, id))
    .returning();

  return deleted ?? null;
}
