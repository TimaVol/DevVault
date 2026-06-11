"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { FormDialog } from "@/components/shared/form-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAsyncAction } from "@/hooks/use-async-action";
import {
  createChecklist,
  updateChecklist,
} from "@/features/checklists/server/actions";
import type { Checklist } from "@/features/checklists/types";

type ChecklistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklist?: Checklist | null;
};

export function ChecklistDialog({
  open,
  onOpenChange,
  checklist,
}: ChecklistDialogProps) {
  const { isLoading, run } = useAsyncAction();
  const [title, setTitle] = useState(checklist?.title ?? "");
  const [description, setDescription] = useState(checklist?.description ?? "");
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<string[]>(
    checklist?.items.map((item) => item.content) ?? [],
  );

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems((prev) => [...prev, newItem.trim()]);
    setNewItem("");
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setNewItem("");
    setItems([]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (items.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    await run(
      () =>
        checklist
          ? updateChecklist(checklist.id, {
              title,
              description: description || undefined,
              items,
            })
          : createChecklist({
              title,
              description: description || undefined,
              items,
            }),
      {
        successMessage: checklist ? "Checklist updated" : "Checklist created",
        errorMessage: checklist ? "Update failed" : "Create failed",
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={checklist ? "Edit checklist" : "New checklist"}
      description="Add items for your launch or review flow."
      onSubmit={submit}
      isLoading={isLoading}
      onBeforeClose={reset}
    >
      <Field>
        <FieldLabel htmlFor="cl-title">Title</FieldLabel>
        <Input
          id="cl-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="cl-desc">Description</FieldLabel>
        <Input
          id="cl-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Items</FieldLabel>
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
            placeholder="Add item…"
          />
          <Button type="button" onClick={addItem}>
            Add
          </Button>
        </div>
        {items.length > 0 ? (
          <ul className="space-y-1 rounded-md border p-2">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span>{item}</span>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </Field>
    </FormDialog>
  );
}
