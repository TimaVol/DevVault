"use client";

import { useMemo } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { useAppShell } from "@/components/layout/app-shell-context";
import { ListEmptyState } from "@/components/layout/list-empty-state";
import { ListPagination } from "@/components/layout/list-pagination";
import { Button } from "@/components/ui/button";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
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
  const { open, setOpen, entity: editing, openCreate, openEdit, dialogKey } =
    useEntityDialog<Project>();
  const { confirmDelete } = useConfirmDelete();

  const shellActions = useMemo(
    () => (
      <Button onClick={openCreate} size="sm">
        <Plus data-icon="inline-start" />
        New Project
      </Button>
    ),
    [openCreate],
  );

  useAppShell({ title: "Projects", actions: shellActions });

  const remove = (id: string) =>
    confirmDelete(() => deleteProject(id), {
      message: "Delete this project?",
      successMessage: "Project deleted",
    });

  return (
    <div className="flex flex-col gap-6">
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
        <ListEmptyState
          icon={FolderKanban}
          title="No active projects"
          description="Start tracking a new repository or local project."
          actionLabel="Initialize Project"
          onAction={openCreate}
        />
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

      <ProjectDialog
        key={dialogKey}
        open={open}
        onOpenChange={setOpen}
        editing={editing}
      />
    </div>
  );
}
