import "server-only";

import { and, desc, eq, or } from "drizzle-orm";
import { requireDrizzle } from "@/server/auth/require-user";
import { createChildStringsListQuery } from "@/server/queries/aggregate-child-strings";
import { paginatedList } from "@/server/queries/paginated-list";
import {
  childStringIlikeExists,
  notDeleted,
  textSearchCondition,
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

  const textSearch = textSearchCondition(params.q, snippets.title, snippets.content);
  if (textSearch) {
    const pattern = `%${params.q}%`;
    conditions.push(
      or(
        textSearch,
        childStringIlikeExists(
          snippetTags,
          snippetTags.snippetId,
          snippetTags.tag,
          snippets.id,
          pattern,
        ),
      )!,
    );
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

export async function getSnippetLanguages(): Promise<string[]> {
  const db = await requireDrizzle();

  const rows = await db.rls((tx) =>
    tx
      .selectDistinct({ language: snippets.language })
      .from(snippets)
      .where(notDeleted(snippets))
      .orderBy(snippets.language),
  );

  return rows.map((row) => row.language);
}
