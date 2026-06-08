"use server";

import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notes } from "@/lib/db/schema";
import { serverFields, withAuthedAction } from "@/lib/db/server-action";
import { ROUTES } from "@/lib/routes";

const insertNoteSchema = createInsertSchema(notes).omit(serverFields);
const updateNoteSchema = createUpdateSchema(notes).omit(serverFields);

export async function createNote(data: {
  title: string;
  content: string;
  isPinned?: boolean;
}) {
  const result = insertNoteSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
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
    return { success: true, note: newNote };
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
  const result = updateNoteSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
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
      return { success: false, error: "Note not found or unauthorized" };
    }

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.notes);
    return { success: true, note: updatedNote };
  });
}

export async function deleteNote(id: string) {
  return withAuthedAction(async (ctx) => {
    const [deleted] = await ctx.rls((tx) =>
      tx
        .update(notes)
        .set({ deletedAt: new Date() })
        .where(eq(notes.id, id))
        .returning(),
    );

    if (!deleted) {
      return { success: false, error: "Note not found or unauthorized" };
    }

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.notes);
    return { success: true };
  });
}
