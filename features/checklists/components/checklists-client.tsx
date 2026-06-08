"use client";

import { useState } from "react";
import { CheckSquare, Plus } from "lucide-react";
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
import { useAsyncAction } from "@/hooks/use-async-action";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { deleteChecklist, toggleChecklistItem } from "@/features/checklists/server/actions";
import type { Checklist } from "@/features/checklists/types";
import { ChecklistCard } from "./checklist-card";
import { ChecklistDialog } from "./checklist-dialog";

export function ChecklistsClient({
  initialChecklists,
}: {
  initialChecklists: Checklist[];
}) {
  const [open, setOpen] = useState(false);
  const { run } = useAsyncAction();
  const { confirmDelete } = useConfirmDelete();

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
      <PageHeader
        title="Checklists"
        description="Launch templates and repeatable QA flows."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus data-icon="inline-start" />
            New checklist
          </Button>
        }
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
            <Button variant="outline" onClick={() => setOpen(true)}>
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
              onDelete={remove}
            />
          ))}
        </div>
      )}

      <ChecklistDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
