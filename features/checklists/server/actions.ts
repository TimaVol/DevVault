"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { asc, eq } from "drizzle-orm";
import { checklists, checklistItems } from "@/lib/db/schema";
import {
  actionFailure,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/server/actions";
import {
  insertWithUserId,
  runDeleteAction,
  updateEntityRow,
} from "@/server/actions/entity-mutations";
import { revalidateEntityPaths } from "@/server/revalidation";
import { parseIdOrFail, zodFailure } from "@/server/validation/action";

const itemsField = z
  .array(z.string().min(1, "Item cannot be empty"))
  .min(1, "At least one item required");

const insertChecklistSchema = createInsertSchema(checklists)
  .omit(serverFields)
  .extend({ items: itemsField });

const updateChecklistSchema = createUpdateSchema(checklists)
  .omit(serverFields)
  .extend({ items: itemsField.optional() });

const NOT_FOUND = "Checklist not found or unauthorized";

export async function createChecklist(
  data: z.input<typeof insertChecklistSchema>,
) {
  const parsed = insertChecklistSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const { items, ...checklistData } = parsed.data;

    const newChecklist = await ctx.rls(async (tx) => {
      const checklist = await insertWithUserId(
        tx,
        checklists,
        ctx.user.id,
        checklistData,
      );

      const itemsToInsert = items.map((content, idx) => ({
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
  data: z.input<typeof updateChecklistSchema>,
) {
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  const parsed = updateChecklistSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const { items: itemValues, ...checklistData } = parsed.data;

    const updatedChecklist = await ctx.rls(async (tx) => {
      const checklist = await updateEntityRow(tx, checklists, id, checklistData);
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
      return actionFailure(NOT_FOUND);
    }

    revalidateEntityPaths("dashboard", "checklists");
    return actionSuccess({ checklist: updatedChecklist });
  });
}

export async function toggleChecklistItem(id: string, isCompleted: boolean) {
  const idError = parseIdOrFail(id);
  if (idError) return idError;

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
  return runDeleteAction(id, checklists, {
    notFoundMessage: NOT_FOUND,
    revalidate: ["dashboard", "checklists"],
  });
}
