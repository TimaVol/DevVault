import "server-only";

import {
  and,
  asc,
  desc,
  inArray,
} from "drizzle-orm";
import { paginatedList } from "@/server/queries/paginated-list";
import { notDeleted, textSearchCondition } from "@/server/queries/filters";
import {
  countTableRows,
  fetchTableRows,
} from "@/server/queries/simple-table-list";
import { defaultListParams } from "@/server/pagination";
import { checklists, checklistItems } from "@/lib/db/schema";
import type { AppDbTransaction } from "@/lib/db/types";
import type { ChecklistListParams } from "./params";

function buildChecklistFilters(params: ChecklistListParams) {
  const conditions = [notDeleted(checklists)];

  const textSearch = textSearchCondition(
    params.q,
    checklists.title,
    checklists.description,
  );
  if (textSearch) {
    conditions.push(textSearch);
  }

  return and(...conditions);
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
  params: ChecklistListParams = defaultListParams({}),
) {
  const where = buildChecklistFilters(params);

  return paginatedList<
    typeof checklists.$inferSelect & {
      items: (typeof checklistItems.$inferSelect)[];
    }
  >({
    params,
    countRows: (tx) => countTableRows(tx, checklists, where),
    fetchRows: async (tx, limit, offset) => {
      const userChecklists = await fetchTableRows<
        typeof checklists.$inferSelect
      >(tx, checklists, where, [desc(checklists.createdAt)], limit, offset);

      return attachChecklistItems(tx, userChecklists);
    },
  });
}
