"use client";

import { useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { ListPagination } from "@/components/layout/list-pagination";
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
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { deleteProject } from "@/features/projects/server/actions";
import type { Project } from "@/features/projects/types";
import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";
import { ProjectsFilterBar } from "./projects-filter-bar";

const PROJECT_FILTER_DEFAULTS = { q: "", tab: "all", page: "1" };

type ProjectsClientProps = {
  initialProjects: Project[];
  pagination: { total: number; page: number; pageSize: number };
};

export function ProjectsClient({
  initialProjects,
  pagination,
}: ProjectsClientProps) {
  const [filters, setFilter] = useUrlFilters({ defaults: PROJECT_FILTER_DEFAULTS });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const { confirmDelete } = useConfirmDelete();

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setOpen(true);
  };

  const remove = (id: string) =>
    confirmDelete(() => deleteProject(id), {
      message: "Delete this project?",
      successMessage: "Project deleted",
    });

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
        tab={filters.tab}
        search={filters.q}
        onTabChange={(value) => {
          setFilter("tab", value);
          setFilter("page", "1");
        }}
        onDebouncedSearchChange={(value) => {
          setFilter("q", value);
          setFilter("page", "1");
        }}
      />

      {initialProjects.length === 0 ? (
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
          {initialProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={remove}
            />
          ))}
        </div>
      )}

      <ListPagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onPageChange={(page) => setFilter("page", String(page))}
      />

      <ProjectDialog key={editing?.id ?? "new"} open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
