"use server";

import { snippets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  isUnauthorized,
  requireDrizzleAction,
} from "@/lib/auth/require-user";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/errors";

export async function createSnippet(data: {
  title: string;
  content: string;
  language: string;
  tags?: string[];
  isPinned?: boolean;
}) {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const [newSnippet] = await ctx.rls((tx) =>
      tx
        .insert(snippets)
        .values({
          userId: ctx.user.id,
          title: data.title,
          content: data.content,
          language: data.language || "javascript",
          tags: data.tags || [],
          isPinned: data.isPinned || false,
        })
        .returning(),
    );

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
  },
) {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const [updatedSnippet] = await ctx.rls((tx) =>
      tx
        .update(snippets)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(snippets.id, id))
        .returning(),
    );

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
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const [deleted] = await ctx.rls((tx) =>
      tx.delete(snippets).where(eq(snippets.id, id)).returning(),
    );

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
