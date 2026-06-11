import Link from "next/link";
import { ArrowUpRight, FolderKanban, Layers, Sparkles } from "lucide-react";
import { ListEmptyState } from "@/components/shared/list-empty-state";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DashboardOverview } from "@/features/dashboard/types";
import { ROUTES } from "@/shared/routes";
import { cn } from "@/utils/cn";

const statusVariant = (status: string) => {
  if (status === "active") return "status" as const;
  if (status === "completed") return "secondary" as const;
  return "outline" as const;
};

export function ActiveProjectsCard({
  projects,
}: {
  projects: DashboardOverview["activeProjects"];
}) {
  return (
    <div className="flex flex-col gap-4 lg:col-span-4">
      <div className="flex items-center justify-between">
        <h3 className="text-headline-sm flex items-center gap-2 font-semibold">
          <Layers className="size-5 text-[#ffb786]" />
          Active Projects
        </h3>
        <Link
          href={ROUTES.projects}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-primary")}
        >
          View all
          <ArrowUpRight data-icon="inline-end" />
        </Link>
      </div>

      {projects.length > 0 ? (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="tonal-card flex items-center gap-3 p-4 transition-colors hover:bg-muted/20"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-primary">
                <FolderKanban className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{project.name}</p>
                  <Badge variant={statusVariant(project.status)} className="shrink-0">
                    {project.status}
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {project.description || "No description"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ListEmptyState
          title="No projects"
          description="Track repos and release context here."
          action={
            <Link
              href={ROUTES.projects}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Add project
            </Link>
          }
        />
      )}

      <div className="relative mt-auto overflow-hidden rounded-lg border border-dashed border-border bg-muted/20 p-6">
        <Sparkles className="absolute -right-4 -bottom-4 size-24 text-primary/10" />
        <p className="text-label-caps mb-2 text-primary">Quick tip</p>
        <p className="text-sm text-muted-foreground">
          Pin your most-used snippets to keep them at the top of your vault.
        </p>
      </div>
    </div>
  );
}
