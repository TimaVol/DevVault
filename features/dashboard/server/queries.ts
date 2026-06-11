import "server-only";

import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { requireDrizzle } from "@/server/auth/require-user";
import { checklists, notes, projects, snippets } from "@/lib/db/schema";

export async function getDashboardOverview() {
  const db = await requireDrizzle();

  return db.rls(async (tx) => {
    const [counts] = await tx
      .select({
        snippetsCount: sql<number>`(
          select count(*)::int from ${snippets}
          where ${snippets.deletedAt} is null
        )`,
        projectsCount: sql<number>`(
          select count(*)::int from ${projects}
          where ${projects.deletedAt} is null
        )`,
        checklistsCount: sql<number>`(
          select count(*)::int from ${checklists}
          where ${checklists.deletedAt} is null
        )`,
        notesCount: sql<number>`(
          select count(*)::int from ${notes}
          where ${notes.deletedAt} is null
        )`,
      })
      .from(sql`(select 1) as _counts`)
      .limit(1);

    const recentSnippets = await tx
      .select()
      .from(snippets)
      .where(isNull(snippets.deletedAt))
      .orderBy(desc(snippets.createdAt))
      .limit(3);

    const activeProjects = await tx
      .select()
      .from(projects)
      .where(and(isNull(projects.deletedAt), eq(projects.status, "active")))
      .orderBy(desc(projects.createdAt))
      .limit(3);

    return {
      snippetsCount: counts?.snippetsCount ?? 0,
      projectsCount: counts?.projectsCount ?? 0,
      checklistsCount: counts?.checklistsCount ?? 0,
      notesCount: counts?.notesCount ?? 0,
      recentSnippets,
      activeProjects,
    };
  });
}
