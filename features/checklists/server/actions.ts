"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { asc, eq } from "drizzle-orm";
import { checklists, checklistItems } from "@/lib/db/schema";
import {
  actionFailure,
  actionOk,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/server/actions";
import { revalidateEntityPaths } from "@/server/revalidation";
import { parseActionId } from "@/server/validation/ids";

const itemsField = z
  .array(z.string().min(1, "Item cannot be empty"))
  .min(1, "At least one item required");

const insertChecklistSchema = createInsertSchema(checklists)
  .omit(serverFields)
  .extend({ items: itemsField });

const updateChecklistSchema = createUpdateSchema(checklists)
  .omit(serverFields)
  .extend({ items: itemsField.optional() });

export async function createChecklist(data: {
  title: string;
  description?: string;
  items: string[];
}) {
  const result = insertChecklistSchema.safeParse(data);
  if (!result.success) {
    return actionFailure(result.error.issues[0].message);
  }

  return withAuthedAction(async (ctx) => {
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

    revalidateEntityPaths("dashboard", "checklists");
    return actionSuccess({ checklist: newChecklist });
  });
}

export async function updateChecklist(
  id: string,
  data: {
    title?: string;
    description?: string;
    items?: string[];
  },
) {
  const idResult = parseActionId(id);
  if (!idResult.success) {
    return actionFailure(idResult.error.issues[0].message);
  }

  const result = updateChecklistSchema.safeParse(data);
  if (!result.success) {
    return actionFailure(result.error.issues[0].message);
  }

  return withAuthedAction(async (ctx) => {
    const { items: itemValues, ...checklistData } = result.data;

    const updatedChecklist = await ctx.rls(async (tx) => {
      const [checklist] = await tx
        .update(checklists)
        .set({ ...checklistData, updatedAt: new Date() })
        .where(eq(checklists.id, id))
        .returning();

      if (!checklist) return null;

      if (itemValues) {
        const existingItems = await tx
          .select()
          .from(checklistItems)
          .where(eq(checklistItems.checklistId, id))
          .orderBy(asc(checklistItems.position));

        await tx.delete(checklistItems).where(eq(checklistItems.checklistId, id));
        await tx.insert(checklistItems).values(
          itemValues.map((content, idx) => ({
            checklistId: id,
            content,
            isCompleted:
              existingItems[idx]?.content === content
                ? existingItems[idx].isCompleted
                : false,
            position: idx,
          })),
        );
      }

      return checklist;
    });

    if (!updatedChecklist) {
      return actionFailure("Checklist not found or unauthorized");
    }

    revalidateEntityPaths("dashboard", "checklists");
    return actionSuccess({ checklist: updatedChecklist });
  });
}

export async function toggleChecklistItem(id: string, isCompleted: boolean) {
  const idResult = parseActionId(id);
  if (!idResult.success) {
    return actionFailure(idResult.error.issues[0].message);
  }

  return withAuthedAction(async (ctx) => {
    const [updated] = await ctx.rls((tx) =>
      tx
        .update(checklistItems)
        .set({ isCompleted, updatedAt: new Date() })
        .where(eq(checklistItems.id, id))
        .returning(),
    );

    if (!updated) {
      return actionFailure("Item not found or unauthorized");
    }

    revalidateEntityPaths("dashboard", "checklists");
    return actionSuccess({ item: updated });
  });
}

export async function deleteChecklist(id: string) {
  const idResult = parseActionId(id);
  if (!idResult.success) {
    return actionFailure(idResult.error.issues[0].message);
  }

  return withAuthedAction(async (ctx) => {
    const [deleted] = await ctx.rls((tx) =>
      tx
        .update(checklists)
        .set({ deletedAt: new Date() })
        .where(eq(checklists.id, id))
        .returning(),
    );

    if (!deleted) {
      return actionFailure("Checklist not found or unauthorized");
    }

    revalidateEntityPaths("dashboard", "checklists");
    return actionOk();
  });
}
