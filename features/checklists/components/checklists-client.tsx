"use client";

import { CheckSquare } from "lucide-react";
import { EntityListLayout } from "@/components/shared/entity-list-layout";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useEntityListPage } from "@/hooks/use-entity-list-page";
import { useShellCreateAction } from "@/hooks/use-shell-create-action";
import type { PaginationMeta } from "@/server/pagination";
import { deleteChecklist, toggleChecklistItem } from "@/features/checklists/server/actions";
import type { Checklist } from "@/features/checklists/types";
import { ChecklistCard } from "./checklist-card";
import { ChecklistDialog } from "./checklist-dialog";
import { ChecklistsFilterBar } from "./checklists-filter-bar";

const CHECKLIST_FILTER_DEFAULTS = { q: "", page: "1" };

type ChecklistsClientProps = {
  initialChecklists: Checklist[];
  pagination: PaginationMeta;
};

export function ChecklistsClient({
  initialChecklists,
  pagination,
}: ChecklistsClientProps) {
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
  } = useEntityListPage<Checklist>({
    filterDefaults: CHECKLIST_FILTER_DEFAULTS,
    onDelete: deleteChecklist,
    deleteMessage: "Delete checklist?",
    deleteSuccessMessage: "Checklist deleted",
  });
  const { run } = useAsyncAction();

  useShellCreateAction("New Checklist", openCreate);

  const toggle = (itemId: string, done: boolean) =>
    run(() => toggleChecklistItem(itemId, !done), {
      errorMessage: "Could not update item",
    });

  return (
    <>
      <EntityListLayout
        filterBar={
          <ChecklistsFilterBar
            search={filters.q}
            onDebouncedSearchChange={(value) => setFilter("q", value, { resetPage: true })}
          />
        }
        isEmpty={initialChecklists.length === 0}
        emptyState={{
          icon: CheckSquare,
          title: "No checklists",
          description: "Create your first launch checklist.",
          actionLabel: "Create checklist",
        }}
        onCreate={openCreate}
        pagination={pagination}
        onPageChange={(page) => setFilter("page", String(page))}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {initialChecklists.map((checklist) => (
            <ChecklistCard
              key={checklist.id}
              checklist={checklist}
              onToggle={toggle}
              onEdit={openEdit}
              onDelete={remove}
            />
          ))}
        </div>
      </EntityListLayout>

      <ChecklistDialog
        key={dialogKey}
        open={open}
        onOpenChange={setOpen}
        entity={editing}
      />
    </>
  );
}
