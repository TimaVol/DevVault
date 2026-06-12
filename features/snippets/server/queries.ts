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
import type { AppDbTransaction } from "@/lib/db/types";
import { getOffset } from "@/server/pagination";
import { ilikeAny, notDeleted } from "@/server/queries/filters";
import { snippets, snippetTags } from "@/lib/db/schema";
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

export async function getSnippets(
  params: SnippetListParams = { lang: "all", page: 1, pageSize: 50 },
) {
  const db = await requireDrizzle();
  const where = buildSnippetFilters(params);
  const offset = getOffset(params.page, params.pageSize);

  return db.rls(async (tx) => {
    const [total, items] = await Promise.all([
      countDistinctSnippets(tx, where),
      fetchSnippetRows(tx, where, params.pageSize, offset),
    ]);

    return { items, total, page: params.page, pageSize: params.pageSize };
  });
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
