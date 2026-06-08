import "server-only";

import { asc, desc, eq, isNull } from "drizzle-orm";
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

    return Promise.all(
      userChecklists.map(async (checklist) => {
        const items = await tx
          .select()
          .from(checklistItems)
          .where(eq(checklistItems.checklistId, checklist.id))
          .orderBy(asc(checklistItems.position));

        return {
          ...checklist,
          items,
        };
      }),
    );
  });
}
