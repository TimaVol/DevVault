"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";
import { snippets, snippetTags } from "@/lib/db/schema";
import {
  actionFailure,
  actionOk,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/server/actions";
import { softDelete } from "@/server/db/soft-delete";
import { syncChildStrings } from "@/server/db/sync-child-strings";
import { revalidateEntityPaths } from "@/server/revalidation";
import { parseIdOrFail, zodFailure } from "@/server/validation/action";

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
  const parsed = insertSnippetSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const newSnippet = await ctx.rls(async (tx) => {
      const [snippet] = await tx
        .insert(snippets)
        .values({
          userId: ctx.user.id,
          title: parsed.data.title,
          content: parsed.data.content,
          language: parsed.data.language ?? "javascript",
          isPinned: parsed.data.isPinned ?? false,
        })
        .returning();

      await syncChildStrings({
        values: parsed.data.tags,
        delete: () =>
          tx.delete(snippetTags).where(eq(snippetTags.snippetId, snippet.id)),
        insert: (tags) =>
          tx
            .insert(snippetTags)
            .values(tags.map((tag) => ({ snippetId: snippet.id, tag }))),
      });

      return snippet;
    });

    revalidateEntityPaths("dashboard", "snippets");
    return actionSuccess({ snippet: newSnippet });
  });
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
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  const parsed = updateSnippetSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const { tags: tagValues, ...snippetData } = parsed.data;

    const updatedSnippet = await ctx.rls(async (tx) => {
      const [snippet] = await tx
        .update(snippets)
        .set({ ...snippetData, updatedAt: new Date() })
        .where(eq(snippets.id, id))
        .returning();

      if (!snippet) return null;

      await syncChildStrings({
        values: tagValues,
        delete: () => tx.delete(snippetTags).where(eq(snippetTags.snippetId, id)),
        insert: (tags) =>
          tx.insert(snippetTags).values(tags.map((tag) => ({ snippetId: id, tag }))),
      });

      return snippet;
    });

    if (!updatedSnippet) {
      return actionFailure("Snippet not found or unauthorized");
    }

    revalidateEntityPaths("dashboard", "snippets");
    return actionSuccess({ snippet: updatedSnippet });
  });
}

export async function deleteSnippet(id: string) {
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  return withAuthedAction(async (ctx) => {
    const deleted = await ctx.rls((tx) => softDelete(tx, snippets, id));

    if (!deleted) {
      return actionFailure("Snippet not found or unauthorized");
    }

    revalidateEntityPaths("dashboard", "snippets");
    return actionOk();
  });
}
