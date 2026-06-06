"use server";

import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { checklists, checklistItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  isUnauthorized,
  requireDrizzleAction,
} from "@/lib/auth/require-user";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/errors";
import { ROUTES } from "@/lib/routes";

const serverFields = {
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

const insertChecklistSchema = createInsertSchema(checklists)
  .omit(serverFields)
  .extend({
    items: z.array(z.string().min(1, "Item cannot be empty")).min(1, "At least one item required"),
  });

export async function createChecklist(data: {
  title: string;
  description?: string;
  items: string[];
}) {
  const result = insertChecklistSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

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
          title: result.data.title,
          description: result.data.description ?? null,
        })
        .returning();

      const itemsToInsert = result.data.items.map((content, idx) => ({
        checklistId: checklist.id,
        content,
        isCompleted: false,
        position: idx,
      }));

      await tx.insert(checklistItems).values(itemsToInsert);

      return checklist;
    });

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.checklists);
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

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.checklists);
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
      tx
        .update(checklists)
        .set({ deletedAt: new Date() })
        .where(eq(checklists.id, id))
        .returning(),
    );

    if (!deleted) {
      return { success: false, error: "Checklist not found or unauthorized" };
    }

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.checklists);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
