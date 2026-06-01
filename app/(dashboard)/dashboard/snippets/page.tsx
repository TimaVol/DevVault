import React from "react";
import { desc } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { snippets } from "@/lib/db/schema";
import { SnippetsClient } from "./snippets-client";

export default async function SnippetsPage() {
  const db = await requireDrizzle();

  const userSnippets = await db.rls((tx) =>
    tx.select().from(snippets).orderBy(desc(snippets.createdAt)),
  );

  return <SnippetsClient initialSnippets={userSnippets} />;
}
