import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { count, desc, eq } from "drizzle-orm";
import { CheckSquare, Code2, ExternalLink, FolderKanban, Plus, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { checklists, notes, projects, snippets } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Live queries using Drizzle ORM
  const [snippetsCountRes] = await db
    .select({ value: count() })
    .from(snippets)
    .where(eq(snippets.userId, user.id));
  const snippetsCount = snippetsCountRes?.value ?? 0;

  const [projectsCountRes] = await db
    .select({ value: count() })
    .from(projects)
    .where(eq(projects.userId, user.id));
  const projectsCount = projectsCountRes?.value ?? 0;

  const [checklistsCountRes] = await db
    .select({ value: count() })
    .from(checklists)
    .where(eq(checklists.userId, user.id));
  const checklistsCount = checklistsCountRes?.value ?? 0;

  const [notesCountRes] = await db
    .select({ value: count() })
    .from(notes)
    .where(eq(notes.userId, user.id));
  const notesCount = notesCountRes?.value ?? 0;

  const recentSnippets = await db
    .select()
    .from(snippets)
    .where(eq(snippets.userId, user.id))
    .orderBy(desc(snippets.createdAt))
    .limit(3);

  const activeProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(desc(projects.createdAt))
    .limit(3);

  const stats = [
    { label: "Snippets", value: snippetsCount.toString(), icon: Code2, href: "/dashboard/snippets" },
    { label: "Projects", value: projectsCount.toString(), icon: FolderKanban, href: "/dashboard/projects" },
    { label: "Checklists", value: checklistsCount.toString(), icon: CheckSquare, href: "/dashboard/checklists" },
    { label: "Notes", value: notesCount.toString(), icon: StickyNote, href: "/dashboard/notes" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Workspace Overview
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Welcome back. Manage your snippets, checklists, and project logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="bg-primary hover:bg-primary-container text-primary-foreground font-medium cursor-pointer">
            <Link href="/dashboard/snippets">
              <Plus className="h-4 w-4 mr-1" /> Create Snippet
            </Link>
          </Button>
        </div>
      </section>

      {/* Grid count cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="group block">
              <Card className="transition-all duration-200 border-border-subtle bg-surface-card hover:border-primary/30 hover:bg-accent/10 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* Dynamic contents lists */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent snippets block */}
        <Card className="border-border-subtle bg-surface-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display text-lg font-bold">Recent Snippets</CardTitle>
              <CardDescription className="text-xs">Quick access to code fragments</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs font-semibold cursor-pointer">
              <Link href="/dashboard/snippets">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentSnippets.length > 0 ? (
              <ul className="space-y-3">
                {recentSnippets.map((snippet) => (
                  <li key={snippet.id} className="group p-3 bg-input/50 rounded-md border border-border-subtle hover:border-primary/20 transition-all flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{snippet.title}</p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">{snippet.language}</p>
                    </div>
                    <Button size="icon" variant="ghost" asChild className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer">
                      <Link href={`/dashboard/snippets?id=${snippet.id}`}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border-subtle rounded-md">
                <p>No snippets found in this workspace.</p>
                <Button variant="outline" size="sm" asChild className="mt-3 cursor-pointer">
                  <Link href="/dashboard/snippets">Create your first snippet</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active projects block */}
        <Card className="border-border-subtle bg-surface-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display text-lg font-bold">Active Projects</CardTitle>
              <CardDescription className="text-xs">Current dev and release progress</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs font-semibold cursor-pointer">
              <Link href="/dashboard/projects">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeProjects.length > 0 ? (
              <ul className="space-y-3">
                {activeProjects.map((project) => (
                  <li key={project.id} className="p-3 bg-input/50 rounded-md border border-border-subtle flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{project.description || "No description provided."}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-primary/20 text-primary border border-primary/10 uppercase tracking-wider">
                      {project.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border-subtle rounded-md">
                <p>No active projects found.</p>
                <Button variant="outline" size="sm" asChild className="mt-3 cursor-pointer">
                  <Link href="/dashboard/projects">Track a new project</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
