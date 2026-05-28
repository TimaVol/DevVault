"use server";

import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/errors";

export async function createSnippet(data: {
  title: string;
  content: string;
  language: string;
  tags?: string[];
  isPinned?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [newSnippet] = await db
      .insert(snippets)
      .values({
        userId: user.id,
        title: data.title,
        content: data.content,
        language: data.language || "javascript",
        tags: data.tags || [],
        isPinned: data.isPinned || false,
      })
      .returning();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/snippets");
    return { success: true, snippet: newSnippet };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateSnippet(
  id: string,
  data: {
    title?: string;
    content?: string;
    language?: string;
    tags?: string[];
    isPinned?: boolean;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updatedSnippet] = await db
      .update(snippets)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(snippets.id, id), eq(snippets.userId, user.id)))
      .returning();

    if (!updatedSnippet) {
      return { success: false, error: "Snippet not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/snippets");
    return { success: true, snippet: updatedSnippet };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteSnippet(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [deleted] = await db
      .delete(snippets)
      .where(and(eq(snippets.id, id), eq(snippets.userId, user.id)))
      .returning();

    if (!deleted) {
      return { success: false, error: "Snippet not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/snippets");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
