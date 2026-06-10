"use client";

import { useMemo, useState } from "react";
import { CheckSquare, Plus } from "lucide-react";
import { useAppShell } from "@/components/layout/app-shell-context";
import { ListPagination } from "@/components/layout/list-pagination";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { deleteChecklist, toggleChecklistItem } from "@/features/checklists/server/actions";
import type { Checklist } from "@/features/checklists/types";
import { ChecklistCard } from "./checklist-card";
import { ChecklistDialog } from "./checklist-dialog";
import { ChecklistsFilterBar } from "./checklists-filter-bar";

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
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Checklist | null>(null);
  const { run } = useAsyncAction();
  const { confirmDelete } = useConfirmDelete();

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const shellActions = useMemo(
    () => (
      <Button onClick={openCreate} size="sm">
        <Plus data-icon="inline-start" />
        New Checklist
      </Button>
    ),
    [],
  );

  useAppShell({ title: "Checklists", actions: shellActions });

  const openEdit = (checklist: Checklist) => {
    setEditing(checklist);
    setOpen(true);
  };

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
      <ChecklistsFilterBar
        search={filters.q}
        onDebouncedSearchChange={(value) => {
          setFilter("q", value);
          setFilter("page", "1");
        }}
      />

      {initialChecklists.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CheckSquare />
            </EmptyMedia>
            <EmptyTitle>No checklists</EmptyTitle>
            <EmptyDescription>Create your first launch checklist.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={openCreate}>
              <Plus data-icon="inline-start" />
              Create checklist
            </Button>
          </EmptyContent>
        </Empty>
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
        key={editing?.id ?? "new"}
        open={open}
        onOpenChange={setOpen}
        checklist={editing}
      />
    </div>
  );
}
