import "server-only";

import { count, desc, isNull } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { checklists, notes, projects, snippets } from "@/lib/db/schema";

export async function getDashboardOverview() {
  const db = await requireDrizzle();

  return db.rls(async (tx) => {
    const [snippetsCountRes] = await tx
      .select({ value: count() })
      .from(snippets)
      .where(isNull(snippets.deletedAt));
    const [projectsCountRes] = await tx
      .select({ value: count() })
      .from(projects)
      .where(isNull(projects.deletedAt));
    const [checklistsCountRes] = await tx
      .select({ value: count() })
      .from(checklists)
      .where(isNull(checklists.deletedAt));
    const [notesCountRes] = await tx
      .select({ value: count() })
      .from(notes)
      .where(isNull(notes.deletedAt));

    const recentSnippets = await tx
      .select()
      .from(snippets)
      .where(isNull(snippets.deletedAt))
      .orderBy(desc(snippets.createdAt))
      .limit(3);

    const activeProjects = await tx
      .select()
      .from(projects)
      .where(isNull(projects.deletedAt))
      .orderBy(desc(projects.createdAt))
      .limit(3);

    return {
      snippetsCount: snippetsCountRes?.value ?? 0,
      projectsCount: projectsCountRes?.value ?? 0,
      checklistsCount: checklistsCountRes?.value ?? 0,
      notesCount: notesCountRes?.value ?? 0,
      recentSnippets,
      activeProjects,
    };
  });
}
