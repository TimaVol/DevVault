import React from "react";
import { redirect } from "next/navigation";
import { eq, desc, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { checklists, checklistItems } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { ChecklistsClient } from "./checklists-client";

export default async function ChecklistsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Load checklists belonging to the current user
  const userChecklists = await db
    .select()
    .from(checklists)
    .where(eq(checklists.userId, user.id))
    .orderBy(desc(checklists.createdAt));

  // Enrich checklists with their corresponding items
  const enrichedChecklists = await Promise.all(
    userChecklists.map(async (checklist) => {
      const items = await db
        .select()
        .from(checklistItems)
        .where(eq(checklistItems.checklistId, checklist.id))
        .orderBy(asc(checklistItems.position));
      
      return {
        ...checklist,
        items,
      };
    })
  );

  return <ChecklistsClient initialChecklists={enrichedChecklists} />;
}
