"use server";

import { checklists, checklistItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  isUnauthorized,
  requireDrizzleAction,
} from "@/lib/auth/require-user";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/errors";

export async function createChecklist(data: {
  title: string;
  description?: string;
  items: string[];
}) {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const newChecklist = await ctx.rls(async (tx) => {
      const [checklist] = await tx
        .insert(checklists)
        .values({
          userId: ctx.user.id,
          title: data.title,
          description: data.description || null,
        })
        .returning();

      if (data.items && data.items.length > 0) {
        const itemsToInsert = data.items.map((content, idx) => ({
          checklistId: checklist.id,
          content,
          isCompleted: false,
          position: idx,
        }));

        await tx.insert(checklistItems).values(itemsToInsert);
      }

      return checklist;
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/checklists");
    return { success: true, checklist: newChecklist };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function toggleChecklistItem(id: string, isCompleted: boolean) {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const [updated] = await ctx.rls((tx) =>
      tx
        .update(checklistItems)
        .set({ isCompleted, updatedAt: new Date() })
        .where(eq(checklistItems.id, id))
        .returning(),
    );

    if (!updated) {
      return { success: false, error: "Item not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/checklists");
    return { success: true, item: updated };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteChecklist(id: string) {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const [deleted] = await ctx.rls((tx) =>
      tx.delete(checklists).where(eq(checklists.id, id)).returning(),
    );

    if (!deleted) {
      return { success: false, error: "Checklist not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/checklists");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
