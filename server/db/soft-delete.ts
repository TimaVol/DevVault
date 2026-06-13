import { eq } from "drizzle-orm";
import type { AppDbTransaction, SoftDeletableTable } from "@/lib/db/types";

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
