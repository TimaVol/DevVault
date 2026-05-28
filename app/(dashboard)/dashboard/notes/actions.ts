"use server";

import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createNote(data: {
  title: string;
  content: string;
  isPinned?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [newNote] = await db
      .insert(notes)
      .values({
        userId: user.id,
        title: data.title,
        content: data.content,
        isPinned: data.isPinned || false,
      })
      .returning();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");
    return { success: true, note: newNote };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateNote(
  id: string,
  data: {
    title?: string;
    content?: string;
    isPinned?: boolean;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updatedNote] = await db
      .update(notes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .returning();

    if (!updatedNote) {
      return { success: false, error: "Note not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");
    return { success: true, note: updatedNote };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [deleted] = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .returning();

    if (!deleted) {
      return { success: false, error: "Note not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
