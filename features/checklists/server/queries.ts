import "server-only";

import { and, asc, desc, ilike, inArray, isNull, or } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { checklists, checklistItems } from "@/lib/db/schema";
import type { ChecklistListParams } from "./params";

function buildChecklistFilters(params: ChecklistListParams) {
  const conditions = [isNull(checklists.deletedAt)];

  if (params.q) {
    const pattern = `%${params.q}%`;
    conditions.push(
      or(
        ilike(checklists.title, pattern),
        ilike(checklists.description, pattern),
      )!,
    );
  }

  return and(...conditions);
}

export async function getChecklists(params: ChecklistListParams = {}) {
  const db = await requireDrizzle();
  const where = buildChecklistFilters(params);

  return db.rls(async (tx) => {
    const userChecklists = await tx
      .select()
      .from(checklists)
      .where(where)
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
