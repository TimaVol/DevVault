import "server-only";

import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import type { AppDbTransaction } from "@/lib/db/types";
import type { PaginatedResult } from "@/lib/db/query-params";
import { getOffset } from "@/lib/db/query-params";
import { snippets, snippetTags } from "@/lib/db/schema";
import type { SnippetListParams } from "./params";

function buildSnippetFilters(params: SnippetListParams) {
  const conditions = [isNull(snippets.deletedAt)];

  if (params.lang !== "all") {
    conditions.push(eq(snippets.language, params.lang));
  }

  if (params.q) {
    const pattern = `%${params.q}%`;
    conditions.push(
      or(
        ilike(snippets.title, pattern),
        ilike(snippets.content, pattern),
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
): Promise<PaginatedResult<Awaited<ReturnType<typeof fetchSnippetRows>>[number]>> {
  const db = await requireDrizzle();
  const where = buildSnippetFilters(params);
  const offset = getOffset(params.page, params.pageSize);

  return db.rls(async (tx) => {
    const [countResult] = await tx
      .select({ value: count(sql`distinct ${snippets.id}`) })
      .from(snippets)
      .leftJoin(snippetTags, eq(snippets.id, snippetTags.snippetId))
      .where(where);

    const items = await fetchSnippetRows(tx, where, params.pageSize, offset);

    return {
      items,
      total: countResult?.value ?? 0,
      page: params.page,
      pageSize: params.pageSize,
    };
  });
}

export async function getSnippetLanguages(): Promise<string[]> {
  const db = await requireDrizzle();

  const rows = await db.rls((tx) =>
    tx
      .selectDistinct({ language: snippets.language })
      .from(snippets)
      .where(isNull(snippets.deletedAt))
      .orderBy(snippets.language),
  );

  return rows.map((row) => row.language);
}
