"use server";

import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { snippets, snippetTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  isUnauthorized,
  requireDrizzleAction,
} from "@/lib/auth/require-user";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/errors";
import { ROUTES } from "@/lib/routes";

import { z } from "zod";

const serverFields = {
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

const tagsField = z.array(z.string()).optional();

const insertSnippetSchema = createInsertSchema(snippets)
  .omit(serverFields)
  .extend({ tags: tagsField });
const updateSnippetSchema = createUpdateSchema(snippets)
  .omit(serverFields)
  .extend({ tags: tagsField });

export async function createSnippet(data: {
  title: string;
  content: string;
  language: string;
  tags?: string[];
  isPinned?: boolean;
}) {
  const result = insertSnippetSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const newSnippet = await ctx.rls(async (tx) => {
      const [snippet] = await tx
        .insert(snippets)
        .values({
          userId: ctx.user.id,
          title: result.data.title,
          content: result.data.content,
          language: result.data.language ?? "javascript",
          isPinned: result.data.isPinned ?? false,
        })
        .returning();

      const newTags = result.data.tags ?? [];
      if (newTags.length > 0) {
        await tx
          .insert(snippetTags)
          .values(newTags.map((tag) => ({ snippetId: snippet.id, tag })));
      }

      return snippet;
    });

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.snippets);
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
  const result = updateSnippetSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const { tags: tagValues, ...snippetData } = result.data;

    const updatedSnippet = await ctx.rls(async (tx) => {
      const [snippet] = await tx
        .update(snippets)
        .set({ ...snippetData, updatedAt: new Date() })
        .where(eq(snippets.id, id))
        .returning();

      if (!snippet) return null;

      await tx.delete(snippetTags).where(eq(snippetTags.snippetId, id));
      const newTags = tagValues ?? [];
      if (newTags.length > 0) {
        await tx
          .insert(snippetTags)
          .values(newTags.map((tag) => ({ snippetId: id, tag })));
      }

      return snippet;
    });

    if (!updatedSnippet) {
      return { success: false, error: "Snippet not found or unauthorized" };
    }

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.snippets);
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
      tx
        .update(snippets)
        .set({ deletedAt: new Date() })
        .where(eq(snippets.id, id))
        .returning(),
    );

    if (!deleted) {
      return { success: false, error: "Snippet not found or unauthorized" };
    }

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.snippets);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
