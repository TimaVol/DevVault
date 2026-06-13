import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import { requireDrizzle } from "@/server/auth/require-user";
import { notDeleted } from "@/server/queries/filters";
import { checklists, notes, projects, snippets } from "@/lib/db/schema";

export async function getDashboardOverview() {
  const db = await requireDrizzle();

  return db.rls(async (tx) => {
    const [counts] = await tx
      .select({
        snippetsCount: sql<number>`(
          select count(*)::int from ${snippets}
          where ${notDeleted(snippets)}
        )`,
        projectsCount: sql<number>`(
          select count(*)::int from ${projects}
          where ${notDeleted(projects)}
        )`,
        checklistsCount: sql<number>`(
          select count(*)::int from ${checklists}
          where ${notDeleted(checklists)}
        )`,
        notesCount: sql<number>`(
          select count(*)::int from ${notes}
          where ${notDeleted(notes)}
        )`,
      })
      .from(sql`(select 1) as _counts`)
      .limit(1);

    const recentSnippets = await tx
      .select()
      .from(snippets)
      .where(notDeleted(snippets))
      .orderBy(desc(snippets.createdAt))
      .limit(3);

    const activeProjects = await tx
      .select()
      .from(projects)
      .where(and(notDeleted(projects), eq(projects.status, "active")))
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
