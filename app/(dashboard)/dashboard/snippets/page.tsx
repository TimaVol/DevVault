import React from "react";
import { desc, eq, getTableColumns, isNull, sql } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { snippets, snippetTags } from "@/lib/db/schema";
import { SnippetsClient } from "./snippets-client";

export default async function SnippetsPage() {
  const db = await requireDrizzle();

  const userSnippets = await db.rls((tx) =>
    tx
      .select({
        ...getTableColumns(snippets),
        tags: sql<string[]>`coalesce(
          array_agg(${snippetTags.tag}) filter (where ${snippetTags.tag} is not null),
          array[]::text[]
        )`,
      })
      .from(snippets)
      .leftJoin(snippetTags, eq(snippets.id, snippetTags.snippetId))
      .where(isNull(snippets.deletedAt))
      .groupBy(snippets.id)
      .orderBy(desc(snippets.createdAt)),
  );

  return <SnippetsClient initialSnippets={userSnippets} />;
}
