import React from "react";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { SnippetsClient } from "./snippets-client";

export default async function SnippetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Load user's snippets from the database
  const userSnippets = await db
    .select()
    .from(snippets)
    .where(eq(snippets.userId, user.id))
    .orderBy(desc(snippets.createdAt));

  return <SnippetsClient initialSnippets={userSnippets} />;
}
