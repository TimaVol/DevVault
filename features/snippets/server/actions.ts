"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { snippets, snippetTags } from "@/lib/db/schema";
import { serverFields } from "@/server/actions";
import {
  contentField,
  tagsField,
  titleField,
} from "@/server/validation/fields";
import {
  insertWithUserId,
  runCreateAction,
  runDeleteAction,
  runUpdateAction,
  updateEntityRow,
} from "@/server/actions/entity-mutations";
import { createChildStringSyncer } from "@/server/db/sync-child-strings";

const insertSnippetSchema = createInsertSchema(snippets)
  .omit(serverFields)
  .extend({
    title: titleField,
    content: contentField,
    tags: tagsField,
  });
const updateSnippetSchema = createUpdateSchema(snippets)
  .omit(serverFields)
  .extend({
    title: titleField.optional(),
    content: contentField.optional(),
    tags: tagsField,
  });

const syncSnippetTags = createChildStringSyncer({
  childTable: snippetTags,
  parentIdColumn: snippetTags.snippetId,
  buildRow: (snippetId, tag) => ({ snippetId, tag }),
});

const NOT_FOUND = "Snippet not found or unauthorized";

export async function createSnippet(data: z.input<typeof insertSnippetSchema>) {
  return runCreateAction(data, {
    schema: insertSnippetSchema,
    resultKey: "snippet",
    revalidate: ["dashboard", "snippets"],
    mutate: (ctx, parsed) => {
      const { tags, ...snippetData } = parsed;

      return ctx.rls(async (tx) => {
        const snippet = await insertWithUserId(tx, snippets, ctx.user.id, {
          language: "javascript",
          isPinned: false,
          ...snippetData,
        });

        await syncSnippetTags(tx, snippet.id, tags);

        return snippet;
      });
    },
  });
}

export async function updateSnippet(
  id: string,
  data: z.input<typeof updateSnippetSchema>,
) {
  return runUpdateAction(id, data, {
    schema: updateSnippetSchema,
    resultKey: "snippet",
    revalidate: ["dashboard", "snippets"],
    notFoundMessage: NOT_FOUND,
    mutate: (ctx, entityId, parsed) => {
      const { tags: tagValues, ...snippetData } = parsed;

      return ctx.rls(async (tx) => {
        const snippet = await updateEntityRow(tx, snippets, entityId, snippetData);
        if (!snippet) return null;

        await syncSnippetTags(tx, entityId, tagValues);

        return snippet;
      });
    },
  });
}

export async function deleteSnippet(id: string) {
  return runDeleteAction(id, snippets, {
    notFoundMessage: NOT_FOUND,
    revalidate: ["dashboard", "snippets"],
  });
}
