"use server";

import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notes } from "@/lib/db/schema";
import {
  actionFailure,
  actionOk,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/server/actions";
import { ROUTES } from "@/shared/routes";
import { parseActionId } from "@/server/validation/ids";

const insertNoteSchema = createInsertSchema(notes).omit(serverFields);
const updateNoteSchema = createUpdateSchema(notes).omit(serverFields);

export async function createNote(data: {
  title: string;
  content: string;
  isPinned?: boolean;
}) {
  const result = insertNoteSchema.safeParse(data);
  if (!result.success) {
    return actionFailure(result.error.issues[0].message);
  }

  return withAuthedAction(async (ctx) => {
    const [newNote] = await ctx.rls((tx) =>
      tx
        .insert(notes)
        .values({
          userId: ctx.user.id,
          title: result.data.title,
          content: result.data.content,
          isPinned: result.data.isPinned ?? false,
        })
        .returning(),
    );

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.notes);
    return actionSuccess({ note: newNote });
  });
}

export async function updateNote(
  id: string,
  data: {
    title?: string;
    content?: string;
    isPinned?: boolean;
  },
) {
  const idResult = parseActionId(id);
  if (!idResult.success) {
    return actionFailure(idResult.error.issues[0].message);
  }

  const result = updateNoteSchema.safeParse(data);
  if (!result.success) {
    return actionFailure(result.error.issues[0].message);
  }

  return withAuthedAction(async (ctx) => {
    const [updatedNote] = await ctx.rls((tx) =>
      tx
        .update(notes)
        .set({
          ...result.data,
          updatedAt: new Date(),
        })
        .where(eq(notes.id, id))
        .returning(),
    );

    if (!updatedNote) {
      return actionFailure("Note not found or unauthorized");
    }

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.notes);
    return actionSuccess({ note: updatedNote });
  });
}

export async function deleteNote(id: string) {
  const idResult = parseActionId(id);
  if (!idResult.success) {
    return actionFailure(idResult.error.issues[0].message);
  }

  return withAuthedAction(async (ctx) => {
    const [deleted] = await ctx.rls((tx) =>
      tx
        .update(notes)
        .set({ deletedAt: new Date() })
        .where(eq(notes.id, id))
        .returning(),
    );

    if (!deleted) {
      return actionFailure("Note not found or unauthorized");
    }

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.notes);
    return actionOk();
  });
}
