import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { createChildStringsListQuery } from "@/server/queries/aggregate-child-strings";
import { paginatedList } from "@/server/queries/paginated-list";
import {
  notDeleted,
  textSearchWithChildStrings,
} from "@/server/queries/filters";
import { defaultListParams } from "@/server/pagination";
import { snippets, snippetTags } from "@/lib/db/schema";
import type { SnippetListParams } from "./params";

type SnippetRow = typeof snippets.$inferSelect & { tags: string[] };

const snippetListQuery = createChildStringsListQuery({
  parentTable: snippets,
  parentIdColumn: snippets.id,
  parentCreatedAtColumn: snippets.createdAt,
  childTable: snippetTags,
  childParentIdColumn: snippetTags.snippetId,
  childValueColumn: snippetTags.tag,
  aggregateKey: "tags",
});

function buildSnippetFilters(params: SnippetListParams) {
  const conditions = [notDeleted(snippets)];

  if (params.lang !== "all") {
    conditions.push(eq(snippets.language, params.lang));
  }

  const textSearch = textSearchWithChildStrings(
    params.q,
    {
      childTable: snippetTags,
      childParentIdCol: snippetTags.snippetId,
      childValueCol: snippetTags.tag,
      parentIdCol: snippets.id,
    },
    snippets.title,
    snippets.content,
  );
  if (textSearch) {
    conditions.push(textSearch);
  }

  return and(...conditions);
}

export async function getSnippets(
  params: SnippetListParams = defaultListParams({ lang: "all" }),
) {
  const where = buildSnippetFilters(params);

  return paginatedList<SnippetRow>({
    params,
    countRows: (tx) => snippetListQuery.countDistinct(tx, where),
    fetchRows: (tx, limit, offset) =>
      snippetListQuery.fetchRows<SnippetRow>(tx, where, limit, offset),
  });
}

