import Link from "next/link";
import { count, desc, isNull } from "drizzle-orm";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { requireDrizzle } from "@/lib/auth/require-user";
import { checklists, notes, projects, snippets } from "@/lib/db/schema";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ActiveProjectsCard } from "./active-projects-card";
import { RecentSnippetsCard } from "./recent-snippets-card";
import { StatsSection } from "./stats-section";

export default async function DashboardPage() {
  const db = await requireDrizzle();

  const {
    snippetsCount,
    projectsCount,
    checklistsCount,
    notesCount,
    recentSnippets,
    activeProjects,
  } = await db.rls(async (tx) => {
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

    const recent = await tx
      .select()
      .from(snippets)
      .where(isNull(snippets.deletedAt))
      .orderBy(desc(snippets.createdAt))
      .limit(3);

    const active = await tx
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
      recentSnippets: recent,
      activeProjects: active,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        description="Snippets, projects, checklists, and notes at a glance."
        actions={
          <Link
            href={ROUTES.snippets}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <Plus data-icon="inline-start" />
            New snippet
          </Link>
        }
      />

      <StatsSection
        snippetsCount={snippetsCount}
        projectsCount={projectsCount}
        checklistsCount={checklistsCount}
        notesCount={notesCount}
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <RecentSnippetsCard snippets={recentSnippets} />
        <ActiveProjectsCard projects={activeProjects} />
      </section>
    </div>
  );
}
