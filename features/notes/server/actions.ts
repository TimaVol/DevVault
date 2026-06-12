"use server";

import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";
import { notes } from "@/lib/db/schema";
import {
  actionFailure,
  actionOk,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/server/actions";
import { softDelete } from "@/server/db/soft-delete";
import { revalidateEntityPaths } from "@/server/revalidation";
import { parseIdOrFail, zodFailure } from "@/server/validation/action";

const insertNoteSchema = createInsertSchema(notes).omit(serverFields);
const updateNoteSchema = createUpdateSchema(notes).omit(serverFields);

export async function createNote(data: {
  title: string;
  content: string;
  isPinned?: boolean;
}) {
  const parsed = insertNoteSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const [newNote] = await ctx.rls((tx) =>
      tx
        .insert(notes)
        .values({
          userId: ctx.user.id,
          title: parsed.data.title,
          content: parsed.data.content,
          isPinned: parsed.data.isPinned ?? false,
        })
        .returning(),
    );

    revalidateEntityPaths("dashboard", "notes");
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
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  const parsed = updateNoteSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const [updatedNote] = await ctx.rls((tx) =>
      tx
        .update(notes)
        .set({
          ...parsed.data,
          updatedAt: new Date(),
        })
        .where(eq(notes.id, id))
        .returning(),
    );

    if (!updatedNote) {
      return actionFailure("Note not found or unauthorized");
    }

    revalidateEntityPaths("dashboard", "notes");
    return actionSuccess({ note: updatedNote });
  });
}

export async function deleteNote(id: string) {
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  return withAuthedAction(async (ctx) => {
    const deleted = await ctx.rls((tx) => softDelete(tx, notes, id));

    if (!deleted) {
      return actionFailure("Note not found or unauthorized");
    }

    revalidateEntityPaths("dashboard", "notes");
    return actionOk();
  });
}
