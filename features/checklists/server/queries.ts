import "server-only";

import {
  and,
  asc,
  count,
  desc,
  ilike,
  inArray,
  isNull,
  or,
} from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import type { PaginatedResult } from "@/lib/db/query-params";
import { getOffset } from "@/lib/db/query-params";
import { checklists, checklistItems } from "@/lib/db/schema";
import type { AppDbTransaction } from "@/lib/db/types";
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

export async function getChecklists(
  params: ChecklistListParams = { page: 1, pageSize: 50 },
): Promise<PaginatedResult<Awaited<ReturnType<typeof attachChecklistItems>>[number]>> {
  const db = await requireDrizzle();
  const where = buildChecklistFilters(params);
  const offset = getOffset(params.page, params.pageSize);

  return db.rls(async (tx) => {
    const [countResult] = await tx
      .select({ value: count() })
      .from(checklists)
      .where(where);

    const userChecklists = await tx
      .select()
      .from(checklists)
      .where(where)
      .orderBy(desc(checklists.createdAt))
      .limit(params.pageSize)
      .offset(offset);

    const items = await attachChecklistItems(tx, userChecklists);

    return {
      items,
      total: countResult?.value ?? 0,
      page: params.page,
      pageSize: params.pageSize,
    };
  });
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
