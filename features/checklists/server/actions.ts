"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";
import { checklists, checklistItems } from "@/lib/db/schema";
import {
  actionFailure,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/server/actions";
import {
  insertWithUserId,
  runCreateAction,
  runDeleteAction,
  runUpdateAction,
  updateEntityRow,
} from "@/server/actions/entity-mutations";
import { syncChecklistItems } from "@/server/db/sync-checklist-items";
import { revalidateEntityPaths } from "@/server/revalidation";
import { parseIdOrFail } from "@/server/validation/action";

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
  return runCreateAction(data, {
    schema: insertChecklistSchema,
    resultKey: "checklist",
    revalidate: ["dashboard", "checklists"],
    mutate: (ctx, parsed) => {
      const { items, ...checklistData } = parsed;

      return ctx.rls(async (tx) => {
        const checklist = await insertWithUserId(
          tx,
          checklists,
          ctx.user.id,
          checklistData,
        );

        await syncChecklistItems(tx, checklist.id, items);

        return checklist;
      });
    },
  });
}

export async function updateChecklist(
  id: string,
  data: z.input<typeof updateChecklistSchema>,
) {
  return runUpdateAction(id, data, {
    schema: updateChecklistSchema,
    resultKey: "checklist",
    revalidate: ["dashboard", "checklists"],
    notFoundMessage: NOT_FOUND,
    mutate: (ctx, entityId, parsed) => {
      const { items: itemValues, ...checklistData } = parsed;

      return ctx.rls(async (tx) => {
        const checklist = await updateEntityRow(tx, checklists, entityId, checklistData);
        if (!checklist) return null;

        if (itemValues) {
          await syncChecklistItems(tx, entityId, itemValues);
        }

        return checklist;
      });
    },
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
