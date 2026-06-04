import Link from "next/link";
import { count, desc } from "drizzle-orm";
import {
  ArrowUpRight,
  CheckSquare,
  Code2,
  FolderKanban,
  Plus,
  StickyNote,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { requireDrizzle } from "@/lib/auth/require-user";
import { checklists, notes, projects, snippets } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

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
      .from(snippets);
    const [projectsCountRes] = await tx
      .select({ value: count() })
      .from(projects);
    const [checklistsCountRes] = await tx
      .select({ value: count() })
      .from(checklists);
    const [notesCountRes] = await tx.select({ value: count() }).from(notes);

    const recent = await tx
      .select()
      .from(snippets)
      .orderBy(desc(snippets.createdAt))
      .limit(3);

    const active = await tx
      .select()
      .from(projects)
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

  const stats = [
    {
      label: "Snippets",
      value: snippetsCount,
      icon: Code2,
      href: "/dashboard/snippets",
    },
    {
      label: "Projects",
      value: projectsCount,
      icon: FolderKanban,
      href: "/dashboard/projects",
    },
    {
      label: "Checklists",
      value: checklistsCount,
      icon: CheckSquare,
      href: "/dashboard/checklists",
    },
    {
      label: "Notes",
      value: notesCount,
      icon: StickyNote,
      href: "/dashboard/notes",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        description="Snippets, projects, checklists, and notes at a glance."
        actions={
          <Link
            href="/dashboard/snippets"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <Plus data-icon="inline-start" />
            New snippet
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="group">
              <Card className="transition-colors hover:bg-muted/40">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                  <Icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold tabular-nums">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Recent snippets</CardTitle>
              <CardDescription>Latest code fragments</CardDescription>
            </div>
            <Link
              href="/dashboard/snippets"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              View all
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentSnippets.length > 0 ? (
              <ul className="divide-y">
                {recentSnippets.map((snippet) => (
                  <li
                    key={snippet.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {snippet.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {snippet.language}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/snippets?id=${snippet.id}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon-sm" }),
                      )}
                    >
                      <ArrowUpRight />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty className="border-none p-0">
                <EmptyHeader>
                  <EmptyTitle>No snippets yet</EmptyTitle>
                  <EmptyDescription>
                    Save your first reusable fragment.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Link
                    href="/dashboard/snippets"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Create snippet
                  </Link>
                </EmptyContent>
              </Empty>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Active projects</CardTitle>
              <CardDescription>Current work in flight</CardDescription>
            </div>
            <Link
              href="/dashboard/projects"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              View all
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </CardHeader>
          <CardContent>
            {activeProjects.length > 0 ? (
              <ul className="divide-y">
                {activeProjects.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {project.description || "No description"}
                      </p>
                    </div>
                    <Badge variant="secondary">{project.status}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty className="border-none p-0">
                <EmptyHeader>
                  <EmptyTitle>No projects</EmptyTitle>
                  <EmptyDescription>
                    Track repos and release context here.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Link
                    href="/dashboard/projects"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Add project
                  </Link>
                </EmptyContent>
              </Empty>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
