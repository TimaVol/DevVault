import "server-only";

import { and, eq, or, sql } from "drizzle-orm";
import { requireDrizzle } from "@/server/auth/require-user";
import { createChildStringsListQuery } from "@/server/queries/aggregate-child-strings";
import { paginatedList } from "@/server/queries/paginated-list";
import { ilikeAny, notDeleted } from "@/server/queries/filters";
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

  if (params.q) {
    const pattern = `%${params.q}%`;
    conditions.push(
      or(
        ilikeAny(pattern, snippets.title, snippets.content),
        sql`exists (
          select 1 from ${snippetTags}
          where ${snippetTags.snippetId} = ${snippets.id}
          and ${snippetTags.tag} ilike ${pattern}
        )`,
      )!,
    );
  }

  return and(...conditions);
}

export async function getSnippets(
  params: SnippetListParams = { q: undefined, lang: "all", page: 1, pageSize: 50 },
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
