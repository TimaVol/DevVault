"use server";

import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { notes } from "@/lib/db/schema";
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

  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
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
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
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

  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
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
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteNote(id: string) {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
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
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
