import "server-only";

import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  or,
  sql,
} from "drizzle-orm";
import { requireDrizzle } from "@/server/auth/require-user";
import { paginatedList } from "@/server/queries/paginated-list";
import { ilikeAny, notDeleted } from "@/server/queries/filters";
import { snippets, snippetTags } from "@/lib/db/schema";
import type { AppDbTransaction } from "@/lib/db/types";
import type { SnippetListParams } from "./params";

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

async function fetchSnippetRows(
  tx: AppDbTransaction,
  where: ReturnType<typeof buildSnippetFilters>,
  limit: number,
  offset: number,
) {
  return tx
    .select({
      ...getTableColumns(snippets),
      tags: sql<string[]>`coalesce(
        array_agg(${snippetTags.tag}) filter (where ${snippetTags.tag} is not null),
        array[]::text[]
      )`,
    })
    .from(snippets)
    .leftJoin(snippetTags, eq(snippets.id, snippetTags.snippetId))
    .where(where)
    .groupBy(snippets.id)
    .orderBy(desc(snippets.createdAt))
    .limit(limit)
    .offset(offset);
}

async function countDistinctSnippets(
  tx: AppDbTransaction,
  where: ReturnType<typeof buildSnippetFilters>,
) {
  const [countResult] = await tx
    .select({ value: count(sql`distinct ${snippets.id}`) })
    .from(snippets)
    .leftJoin(snippetTags, eq(snippets.id, snippetTags.snippetId))
    .where(where);
  return countResult?.value ?? 0;
}

export async function getSnippets(
  params: SnippetListParams = { q: undefined, lang: "all", page: 1, pageSize: 50 },
) {
  const where = buildSnippetFilters(params);

  return paginatedList({
    params,
    countRows: (tx) => countDistinctSnippets(tx, where),
    fetchRows: (tx, limit, offset) => fetchSnippetRows(tx, where, limit, offset),
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
