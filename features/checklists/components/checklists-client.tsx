"use client";

import { useMemo } from "react";
import { CheckSquare, Plus } from "lucide-react";
import { useAppShell } from "@/components/layout/app-shell-context";
import { DebouncedSearchInput } from "@/components/shared/debounced-search-input";
import { ListEmptyState } from "@/components/shared/list-empty-state";
import { ListFilterBar } from "@/components/shared/list-filter-bar";
import { ListPagination } from "@/components/shared/list-pagination";
import { Button } from "@/components/ui/button";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { deleteChecklist, toggleChecklistItem } from "@/features/checklists/server/actions";
import type { Checklist } from "@/features/checklists/types";
import { ChecklistCard } from "./checklist-card";
import { ChecklistDialog } from "./checklist-dialog";

const CHECKLIST_FILTER_DEFAULTS = { q: "", page: "1" };

type ChecklistsClientProps = {
  initialChecklists: Checklist[];
  pagination: { total: number; page: number; pageSize: number };
};

export function ChecklistsClient({
  initialChecklists,
  pagination,
}: ChecklistsClientProps) {
  const [filters, setFilter] = useUrlFilters({ defaults: CHECKLIST_FILTER_DEFAULTS });
  const { open, setOpen, entity: editing, openCreate, openEdit, dialogKey } =
    useEntityDialog<Checklist>();
  const { run } = useAsyncAction();
  const { confirmDelete } = useConfirmDelete();

  const shellActions = useMemo(
    () => (
      <Button onClick={openCreate} size="sm">
        <Plus data-icon="inline-start" />
        New Checklist
      </Button>
    ),
    [openCreate],
  );

  useAppShell({ actions: shellActions });

  const toggle = (itemId: string, done: boolean) =>
    run(() => toggleChecklistItem(itemId, !done), {
      errorMessage: "Could not update item",
    });

  const remove = (id: string) =>
    confirmDelete(() => deleteChecklist(id), {
      message: "Delete checklist?",
      successMessage: "Checklist deleted",
    });

  return (
    <div className="flex flex-col gap-6">
      <ListFilterBar>
        <DebouncedSearchInput
          placeholder="Search checklists…"
          value={filters.q}
          onDebouncedChange={(value) => {
            setFilter("q", value);
            setFilter("page", "1");
          }}
          className="sm:max-w-xs"
        />
      </ListFilterBar>

      {initialChecklists.length === 0 ? (
        <ListEmptyState
          icon={CheckSquare}
          title="No checklists"
          description="Create your first launch checklist."
          actionLabel="Create checklist"
          onAction={openCreate}
        />
      ) : (
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
      )}

      <ListPagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onPageChange={(page) => setFilter("page", String(page))}
      />

      <ChecklistDialog
        key={dialogKey}
        open={open}
        onOpenChange={setOpen}
        checklist={editing}
      />
    </div>
  );
}
