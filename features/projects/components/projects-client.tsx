"use client";

import { FolderKanban } from "lucide-react";
import { EntityListLayout } from "@/components/shared/entity-list-layout";
import { useEntityListPage } from "@/hooks/use-entity-list-page";
import { useShellCreateAction } from "@/hooks/use-shell-create-action";
import type { PaginationMeta } from "@/server/pagination";
import { deleteProject } from "@/features/projects/server/actions";
import type { Project } from "@/features/projects/types";
import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";
import { ProjectsFilterBar } from "./projects-filter-bar";

const PROJECT_FILTER_DEFAULTS = { q: "", tab: "all", page: "1" };

type ProjectsClientProps = {
  initialProjects: Project[];
  pagination: PaginationMeta;
};

export function ProjectsClient({
  initialProjects,
  pagination,
}: ProjectsClientProps) {
  const {
    filters,
    setFilter,
    open,
    setOpen,
    entity: editing,
    openCreate,
    openEdit,
    dialogKey,
    remove,
  } = useEntityListPage<Project>({
    filterDefaults: PROJECT_FILTER_DEFAULTS,
    onDelete: deleteProject,
    deleteMessage: "Delete this project?",
    deleteSuccessMessage: "Project deleted",
  });

  useShellCreateAction("New Project", openCreate);

  return (
    <>
      <EntityListLayout
        filterBar={
          <ProjectsFilterBar
            tab={filters.tab}
            search={filters.q}
            onTabChange={(value) => setFilter("tab", value, { resetPage: true })}
            onDebouncedSearchChange={(value) => setFilter("q", value, { resetPage: true })}
          />
        }
        isEmpty={initialProjects.length === 0}
        emptyState={{
          icon: FolderKanban,
          title: "No active projects",
          description: "Start tracking a new repository or local project.",
          actionLabel: "Initialize Project",
        }}
        onCreate={openCreate}
        pagination={pagination}
        onPageChange={(page) => setFilter("page", String(page))}
      >
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
      </EntityListLayout>

      <ProjectDialog
        key={dialogKey}
        open={open}
        onOpenChange={setOpen}
        entity={editing}
      />
    </>
  );
}
