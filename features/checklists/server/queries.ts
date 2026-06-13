import "server-only";

import {
  and,
  asc,
  count,
  desc,
  inArray,
} from "drizzle-orm";
import { paginatedList } from "@/server/queries/paginated-list";
import { ilikeAny, notDeleted } from "@/server/queries/filters";
import { checklists, checklistItems } from "@/lib/db/schema";
import type { AppDbTransaction } from "@/lib/db/types";
import type { ChecklistListParams } from "./params";

function buildChecklistFilters(params: ChecklistListParams) {
  const conditions = [notDeleted(checklists)];

  if (params.q) {
    const pattern = `%${params.q}%`;
    conditions.push(
      ilikeAny(pattern, checklists.title, checklists.description),
    );
  }

  return and(...conditions);
}

async function countRows(
  tx: AppDbTransaction,
  where: ReturnType<typeof buildChecklistFilters>,
) {
  const [countResult] = await tx
    .select({ value: count() })
    .from(checklists)
    .where(where);
  return countResult?.value ?? 0;
}

async function fetchChecklistRows(
  tx: AppDbTransaction,
  where: ReturnType<typeof buildChecklistFilters>,
  limit: number,
  offset: number,
) {
  const userChecklists = await tx
    .select()
    .from(checklists)
    .where(where)
    .orderBy(desc(checklists.createdAt))
    .limit(limit)
    .offset(offset);

  return attachChecklistItems(tx, userChecklists);
}

async function attachChecklistItems(
  tx: AppDbTransaction,
  userChecklists: (typeof checklists.$inferSelect)[],
) {
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
}

export async function getChecklists(
  params: ChecklistListParams = { q: undefined, page: 1, pageSize: 50 },
) {
  const where = buildChecklistFilters(params);

  return paginatedList({
    params,
    countRows: (tx) => countRows(tx, where),
    fetchRows: (tx, limit, offset) => fetchChecklistRows(tx, where, limit, offset),
  });
}
