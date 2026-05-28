"use server";

import { db } from "@/lib/db";
import { checklists, checklistItems } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createChecklist(data: {
  title: string;
  description?: string;
  items: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // 1. Insert checklist
    const [newChecklist] = await db
      .insert(checklists)
      .values({
        userId: user.id,
        title: data.title,
        description: data.description || null,
      })
      .returning();

    // 2. Insert checklist items in bulk or sequence
    if (data.items && data.items.length > 0) {
      const itemsToInsert = data.items.map((content, idx) => ({
        checklistId: newChecklist.id,
        content,
        isCompleted: false,
        position: idx,
      }));

      await db.insert(checklistItems).values(itemsToInsert);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/checklists");
    return { success: true, checklist: newChecklist };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleChecklistItem(id: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updated] = await db
      .update(checklistItems)
      .set({ isCompleted, updatedAt: new Date() })
      .where(eq(checklistItems.id, id))
      .returning();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/checklists");
    return { success: true, item: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteChecklist(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [deleted] = await db
      .delete(checklists)
      .where(and(eq(checklists.id, id), eq(checklists.userId, user.id)))
      .returning();

    if (!deleted) {
      return { success: false, error: "Checklist not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/checklists");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
