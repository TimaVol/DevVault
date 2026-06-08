"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAsyncAction } from "@/hooks/use-async-action";
import { createChecklist } from "@/features/checklists/server/actions";

type ChecklistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChecklistDialog({ open, onOpenChange }: ChecklistDialogProps) {
  const { isLoading, run } = useAsyncAction();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<string[]>([]);

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
        createChecklist({
          title,
          description: description || undefined,
          items,
        }),
      {
        successMessage: "Checklist created",
        errorMessage: "Create failed",
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New checklist</DialogTitle>
          <DialogDescription>Add items for your launch or review flow.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <FieldGroup className="py-2">
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
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
