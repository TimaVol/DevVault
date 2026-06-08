import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/utils/cn";
import { ActiveProjectsCard } from "@/features/dashboard/components/active-projects-card";
import { RecentSnippetsCard } from "@/features/dashboard/components/recent-snippets-card";
import { StatsSection } from "@/features/dashboard/components/stats-section";
import { getDashboardOverview } from "@/features/dashboard/server/queries";

export default async function DashboardPage() {
  const {
    snippetsCount,
    projectsCount,
    checklistsCount,
    notesCount,
    recentSnippets,
    activeProjects,
  } = await getDashboardOverview();

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
