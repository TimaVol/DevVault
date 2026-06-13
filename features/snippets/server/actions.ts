"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { snippets, snippetTags } from "@/lib/db/schema";
import {
  actionFailure,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/server/actions";
import {
  insertWithUserId,
  runDeleteAction,
  updateEntityRow,
} from "@/server/actions/entity-mutations";
import { createChildStringSyncer } from "@/server/db/sync-child-strings";
import { revalidateEntityPaths } from "@/server/revalidation";
import { parseIdOrFail, zodFailure } from "@/server/validation/action";

const tagsField = z.array(z.string()).optional();

const insertSnippetSchema = createInsertSchema(snippets)
  .omit(serverFields)
  .extend({ tags: tagsField });
const updateSnippetSchema = createUpdateSchema(snippets)
  .omit(serverFields)
  .extend({ tags: tagsField });

const syncSnippetTags = createChildStringSyncer({
  childTable: snippetTags,
  parentIdColumn: snippetTags.snippetId,
  buildRow: (snippetId, tag) => ({ snippetId, tag }),
});

const NOT_FOUND = "Snippet not found or unauthorized";

export async function createSnippet(data: z.input<typeof insertSnippetSchema>) {
  const parsed = insertSnippetSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const { tags, ...snippetData } = parsed.data;

    const newSnippet = await ctx.rls(async (tx) => {
      const snippet = await insertWithUserId(tx, snippets, ctx.user.id, {
        language: "javascript",
        isPinned: false,
        ...snippetData,
      });

      await syncSnippetTags(tx, snippet.id, tags);

      return snippet;
    });

    revalidateEntityPaths("dashboard", "snippets");
    return actionSuccess({ snippet: newSnippet });
  });
}

export async function updateSnippet(
  id: string,
  data: z.input<typeof updateSnippetSchema>,
) {
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  const parsed = updateSnippetSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const { tags: tagValues, ...snippetData } = parsed.data;

    const updatedSnippet = await ctx.rls(async (tx) => {
      const snippet = await updateEntityRow(tx, snippets, id, snippetData);
      if (!snippet) return null;

      await syncSnippetTags(tx, id, tagValues);

      return snippet;
    });

    if (!updatedSnippet) {
      return actionFailure(NOT_FOUND);
    }

    revalidateEntityPaths("dashboard", "snippets");
    return actionSuccess({ snippet: updatedSnippet });
  });
}

export async function deleteSnippet(id: string) {
  return runDeleteAction(id, snippets, {
    notFoundMessage: NOT_FOUND,
    revalidate: ["dashboard", "snippets"],
  });
}
