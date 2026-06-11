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
import { requireDrizzle } from "@/server/auth/require-user";
import type { ListParams } from "@/server/pagination";
import { paginatedQuery } from "@/server/queries/paginated";
import { checklists, checklistItems } from "@/lib/db/schema";
import type { AppDbTransaction } from "@/lib/db/types";

export type ChecklistListParams = ListParams & {
  page: number;
  pageSize: number;
};

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
) {
  const db = await requireDrizzle();
  const where = buildChecklistFilters(params);

  return db.rls((tx) =>
    paginatedQuery({
      tx,
      page: params.page,
      pageSize: params.pageSize,
      getTotal: async () => {
        const [countResult] = await tx
          .select({ value: count() })
          .from(checklists)
          .where(where);
        return countResult?.value ?? 0;
      },
      getItems: async (offset, limit) => {
        const userChecklists = await tx
          .select()
          .from(checklists)
          .where(where)
          .orderBy(desc(checklists.createdAt))
          .limit(limit)
          .offset(offset);
        return attachChecklistItems(tx, userChecklists);
      },
    }),
  );
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
