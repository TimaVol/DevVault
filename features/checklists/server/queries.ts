import "server-only";

import { asc, desc, inArray, isNull } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { checklists, checklistItems } from "@/lib/db/schema";

export async function getChecklists() {
  const db = await requireDrizzle();

  return db.rls(async (tx) => {
    const userChecklists = await tx
      .select()
      .from(checklists)
      .where(isNull(checklists.deletedAt))
      .orderBy(desc(checklists.createdAt));

    if (userChecklists.length === 0) {
      return [];
    }

    const checklistIds = userChecklists.map((checklist) => checklist.id);
    const allItems = await tx
      .select()
      .from(checklistItems)
      .where(inArray(checklistItems.checklistId, checklistIds))
      .orderBy(asc(checklistItems.position));

    const itemsByChecklistId = new Map<string, typeof allItems>();
    for (const item of allItems) {
      const list = itemsByChecklistId.get(item.checklistId) ?? [];
      list.push(item);
      itemsByChecklistId.set(item.checklistId, list);
    }

    return userChecklists.map((checklist) => ({
      ...checklist,
      items: itemsByChecklistId.get(checklist.id) ?? [],
    }));
  });
}
