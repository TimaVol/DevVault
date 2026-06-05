"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FolderKanban, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getErrorMessage } from "@/utils/errors";
import { deleteProject } from "./actions";
import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";
import { ProjectsFilterBar } from "./projects-filter-bar";

type Project = {
  id: string;
  name: string;
  description: string | null;
  repositoryUrl: string | null;
  demoUrl: string | null;
  status: string;
  techStack: string[] | null;
};

export function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setOpen(true);
  };

  const filtered = initialProjects.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.description?.toLowerCase().includes(q) ?? false) ||
      (p.techStack?.some((t) => t.toLowerCase().includes(q)) ?? false);
    const matchesTab = tab === "all" || p.status === tab;
    return matchesSearch && matchesTab;
  });

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await deleteProject(id);
      if (res.success) toast.success("Project deleted");
      else toast.error(res.error || "Delete failed");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Projects"
        description="Track repos, demos, and delivery status."
        actions={
          <Button onClick={openCreate}>
            <Plus data-icon="inline-start" />
            Add project
          </Button>
        }
      />

      <ProjectsFilterBar
        tab={tab}
        search={search}
        onTabChange={setTab}
        onSearchChange={setSearch}
      />

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderKanban />
            </EmptyMedia>
            <EmptyTitle>No projects</EmptyTitle>
            <EmptyDescription>Create a project to track your work.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={openCreate}>
              Add project
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={remove}
            />
          ))}
        </div>
      )}

      <ProjectDialog key={editing?.id ?? "new"} open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
