"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  CheckSquare,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/utils/errors";
import { createChecklist, deleteChecklist, toggleChecklistItem } from "./actions";

interface ChecklistsClientProps {
  initialChecklists: any[];
}

export function ChecklistsClient({ initialChecklists }: ChecklistsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [itemsList, setItemsList] = useState<string[]>([]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setItemsList([...itemsList, newItemText.trim()]);
    setNewItemText("");
  };

  const handleRemoveItem = (idx: number) => {
    setItemsList(itemsList.filter((_, i) => i !== idx));
  };

  const handleCreateChecklist = () => {
    setTitle("");
    setDescription("");
    setNewItemText("");
    setItemsList([]);
    setIsDialogOpen(true);
  };

  const handleToggleItem = async (itemId: string, currentStatus: boolean) => {
    try {
      const res = await toggleChecklistItem(itemId, !currentStatus);
      if (res.success) {
        toast.success("Item state saved");
      } else {
        toast.error("Failed to toggle item state");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this checklist?")) {
      try {
        const res = await deleteChecklist(id);
        if (res.success) {
          toast.success("Checklist deleted successfully!");
        } else {
          toast.error(res.error || "Failed to delete checklist");
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Checklist title is required");
      return;
    }
    if (itemsList.length === 0) {
      toast.error("Please add at least one item to the checklist");
      return;
    }

    setIsLoading(true);

    try {
      const res = await createChecklist({
        title,
        description: description || undefined,
        items: itemsList,
      });

      if (res.success) {
        toast.success("Checklist created successfully!");
        setIsDialogOpen(false);
      } else {
        toast.error(res.error || "Failed to create checklist");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Release Checklists
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build launch templates, audit checklists, and ship production ready features securely.
          </p>
        </div>
        <Button
          onClick={handleCreateChecklist}
          size="sm"
          className="bg-primary hover:bg-primary-container text-primary-foreground font-semibold flex items-center gap-1.5 cursor-pointer self-start md:self-auto h-9"
        >
          <Plus className="h-4 w-4" /> Add Checklist
        </Button>
      </section>

      {/* Checklists grid list */}
      <section className="grid gap-6 md:grid-cols-2">
        {initialChecklists.length > 0 ? (
          initialChecklists.map((checklist) => {
            const completedCount = checklist.items.filter((i: any) => i.isCompleted).length;
            const totalCount = checklist.items.length;
            const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <Card key={checklist.id} className="border-border-subtle bg-surface-card flex flex-col justify-between">
                <CardContent className="p-5 space-y-4">
                  {/* Top Info */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-base font-bold text-foreground">{checklist.title}</h3>
                      {checklist.description && (
                        <p className="text-xs text-muted-foreground mt-1">{checklist.description}</p>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(checklist.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      <span>Progress</span>
                      <span>
                        {completedCount} of {totalCount} completed ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-accent border border-border-subtle rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Items list */}
                  <ul className="space-y-2 border-t border-border-subtle pt-3 mt-2">
                    {checklist.items.map((item: any) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 py-1 text-sm font-medium text-foreground"
                      >
                        <input
                          type="checkbox"
                          checked={item.isCompleted}
                          onChange={() => handleToggleItem(item.id, item.isCompleted)}
                          className="h-4 w-4 rounded-sm border border-border-subtle bg-input/50 text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                        <span className={item.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}>
                          {item.content}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="md:col-span-2 text-center py-16 text-sm text-muted-foreground border border-dashed border-border-subtle rounded-md">
            <CheckSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-medium text-foreground">No checklists found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add QA checklists, launch preps, and secure checks to prevent bugs.
            </p>
            <Button onClick={handleCreateChecklist} variant="outline" size="sm" className="mt-4 cursor-pointer">
              Create your first checklist
            </Button>
          </div>
        )}
      </section>

      {/* Editor Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-lg border border-border-subtle bg-surface-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Create Launch Checklist</h2>
                <p className="text-xs text-muted-foreground">Add checks and repeat launch parameters</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
                className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-sm cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Checklist Title <span className="text-primary">*</span>
                </label>
                <Input
                  placeholder="e.g. Production Release Checklist"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-input/50 border-border-subtle text-sm h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </label>
                <Input
                  placeholder="Summarize when to execute this checklist..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-input/50 border-border-subtle text-sm h-10"
                />
              </div>

              {/* Add item tools */}
              <div className="border-t border-border-subtle pt-3 space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Add Checklist Items <span className="text-primary">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Run database migrations"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newItemText.trim()) {
                          setItemsList([...itemsList, newItemText.trim()]);
                          setNewItemText("");
                        }
                      }
                    }}
                    className="bg-input/50 border-border-subtle text-sm h-10 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      if (newItemText.trim()) {
                        setItemsList([...itemsList, newItemText.trim()]);
                        setNewItemText("");
                      }
                    }}
                    className="bg-primary hover:bg-primary-container text-primary-foreground cursor-pointer h-10 text-xs px-4"
                  >
                    Add
                  </Button>
                </div>

                {/* Items draft lists */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto border border-border-subtle bg-input/20 p-3 rounded-md">
                  {itemsList.length > 0 ? (
                    <ul className="space-y-2">
                      {itemsList.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between gap-3 text-xs bg-accent/40 p-2 rounded border border-border-subtle font-medium text-foreground"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-muted-foreground hover:text-destructive bg-transparent cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic py-1">
                      {/* Added items list will appear here */}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions footer */}
              <div className="border-t border-border-subtle pt-4 mt-2 flex justify-end gap-2 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary-container text-primary-foreground font-semibold cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    "Save Checklist"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
