import { asc, eq } from "drizzle-orm";
import type { AppDbTransaction } from "@/lib/db/types";
import { checklistItems } from "@/lib/db/schema";

export async function syncChecklistItems(
  tx: AppDbTransaction,
  checklistId: string,
  contents: string[],
) {
  const existingItems = await tx
    .select()
    .from(checklistItems)
    .where(eq(checklistItems.checklistId, checklistId))
    .orderBy(asc(checklistItems.position));

  const completionByContent = new Map<string, boolean>();
  for (const item of existingItems) {
    if (!completionByContent.has(item.content)) {
      completionByContent.set(item.content, item.isCompleted);
    }
  }

  await tx.delete(checklistItems).where(eq(checklistItems.checklistId, checklistId));

  if (contents.length === 0) return;

  await tx.insert(checklistItems).values(
    contents.map((content, idx) => ({
      checklistId,
      content,
      isCompleted: completionByContent.get(content) ?? false,
      position: idx,
    })),
  );
}
