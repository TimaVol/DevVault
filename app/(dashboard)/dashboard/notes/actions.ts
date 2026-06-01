"use server";

import { notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  isUnauthorized,
  requireDrizzleAction,
} from "@/lib/auth/require-user";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/errors";

export async function createNote(data: {
  title: string;
  content: string;
  isPinned?: boolean;
}) {
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
          title: data.title,
          content: data.content,
          isPinned: data.isPinned || false,
        })
        .returning(),
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");
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
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const [updatedNote] = await ctx.rls((tx) =>
      tx
        .update(notes)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(notes.id, id))
        .returning(),
    );

    if (!updatedNote) {
      return { success: false, error: "Note not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");
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
      tx.delete(notes).where(eq(notes.id, id)).returning(),
    );

    if (!deleted) {
      return { success: false, error: "Note not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
