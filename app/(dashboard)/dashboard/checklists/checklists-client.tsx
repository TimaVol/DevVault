"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckSquare, Loader2, Plus, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Progress } from "@/components/ui/progress";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getErrorMessage } from "@/utils/errors";
import {
  createChecklist,
  deleteChecklist,
  toggleChecklistItem,
} from "./actions";

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
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<string[]>([]);

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, newItem.trim()]);
    setNewItem("");
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

    setLoading(true);
    try {
      const res = await createChecklist({
        title,
        description: description || undefined,
        items,
      });
      if (res.success) {
        toast.success("Checklist created");
        setOpen(false);
        setTitle("");
        setDescription("");
        setItems([]);
      } else {
        toast.error(res.error || "Create failed");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

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
          <Button
            onClick={() => {
              setTitle("");
              setDescription("");
              setItems([]);
              setOpen(true);
            }}
          >
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
          {initialChecklists.map((checklist) => {
            const done = checklist.items.filter((i) => i.isCompleted).length;
            const total = checklist.items.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Card key={checklist.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <div>
                    <CardTitle>{checklist.title}</CardTitle>
                    {checklist.description ? (
                      <p className="text-sm text-muted-foreground">{checklist.description}</p>
                    ) : null}
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => remove(checklist.id)}
                  >
                    <Trash2 />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {done}/{total} done
                      </span>
                      <Badge variant="secondary">{pct}%</Badge>
                    </div>
                    <Progress value={pct} />
                  </div>
                  <ul className="space-y-2">
                    {checklist.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={item.isCompleted}
                          onCheckedChange={() => toggle(item.id, item.isCompleted)}
                        />
                        <span
                          className={
                            item.isCompleted
                              ? "text-muted-foreground line-through"
                              : undefined
                          }
                        >
                          {item.content}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
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
                          onClick={() => setItems(items.filter((_, i) => i !== idx))}
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
