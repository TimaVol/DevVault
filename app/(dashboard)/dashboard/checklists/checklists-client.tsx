"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { getErrorMessage } from "@/utils/errors";
import { deleteChecklist, toggleChecklistItem } from "./actions";
import { ChecklistCard } from "./checklist-card";
import { ChecklistDialog } from "./checklist-dialog";

type ChecklistItem = {
  id: string;
  content: string;
  isCompleted: boolean;
};

type Checklist = {
  id: string;
  title: string;
  description: string | null;
  items: ChecklistItem[];
};

export function ChecklistsClient({
  initialChecklists,
}: {
  initialChecklists: Checklist[];
}) {
  const [open, setOpen] = useState(false);

  const toggle = async (itemId: string, done: boolean) => {
    try {
      const res = await toggleChecklistItem(itemId, !done);
      if (!res.success) toast.error("Could not update item");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete checklist?")) return;
    try {
      const res = await deleteChecklist(id);
      if (res.success) toast.success("Checklist deleted");
      else toast.error(res.error || "Delete failed");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

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
