import React from "react";
import { asc, desc, eq } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { checklists, checklistItems } from "@/lib/db/schema";
import { ChecklistsClient } from "./checklists-client";

export default async function ChecklistsPage() {
  const db = await requireDrizzle();

  const enrichedChecklists = await db.rls(async (tx) => {
    const userChecklists = await tx
      .select()
      .from(checklists)
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

  return <ChecklistsClient initialChecklists={enrichedChecklists} />;
}
