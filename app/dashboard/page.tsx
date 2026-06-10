import { ActiveProjectsCard } from "@/features/dashboard/components/active-projects-card";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
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
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <StatsSection
          snippetsCount={snippetsCount}
          projectsCount={projectsCount}
          checklistsCount={checklistsCount}
          notesCount={notesCount}
        />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <RecentSnippetsCard snippets={recentSnippets} />
          <ActiveProjectsCard projects={activeProjects} />
        </section>
      </div>
    </DashboardShell>
  );
}
