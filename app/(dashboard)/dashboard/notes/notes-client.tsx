"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Edit,
  Eye,
  Loader2,
  Pin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/errors";
import { createNote, deleteNote, updateNote } from "./actions";

type Note = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date | string;
};

export function NotesClient({ initialNotes }: { initialNotes: Note[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    initialNotes.length > 0 ? initialNotes[0].id : null,
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activeNote = initialNotes.find((n) => n.id === activeNoteId);
  const [title, setTitle] = useState(activeNote?.title || "");
  const [content, setContent] = useState(activeNote?.content || "");
  const [isPinned, setIsPinned] = useState(activeNote?.isPinned || false);

  React.useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setIsPinned(activeNote.isPinned);
    } else {
      setTitle("");
      setContent("");
      setIsPinned(false);
    }
  }, [activeNoteId, initialNotes]);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const res = await createNote({
        title: "Untitled Note",
        content:
          "Write down your daily dev log or technical task description...",
        isPinned: false,
      });
      if (res.success && res.note) {
        toast.success("New note created");
        setActiveNoteId(res.note.id);
      } else {
        toast.error("Failed to create note");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!activeNoteId) return;
    if (!title.trim()) {
      toast.error("Note title is required");
      return;
    }
    setIsLoading(true);
    try {
      const res = await updateNote(activeNoteId, { title, content, isPinned });
      if (res.success) toast.success("Note saved");
      else toast.error(res.error || "Failed to save note");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activeNoteId) return;
    if (!window.confirm("Delete this note?")) return;
    setIsLoading(true);
    try {
      const res = await deleteNote(activeNoteId);
      if (res.success) {
        toast.success("Note deleted");
        const remaining = initialNotes.filter((n) => n.id !== activeNoteId);
        setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
      } else {
        toast.error(res.error || "Failed to delete note");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotes = initialNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dev notes"
        description="Daily logs, design drafts, and pinned reminders."
        actions={
          <Button onClick={handleCreate} disabled={isLoading}>
            <Plus data-icon="inline-start" />
            New note
          </Button>
        }
      />

      <div className="flex min-h-[480px] flex-col gap-4 md:flex-row">
        <Card className="flex w-full shrink-0 flex-col md:w-72">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-0">
            <ScrollArea className="h-[420px] pr-2">
              {sortedNotes.length > 0 ? (
                <ul className="space-y-1">
                  {sortedNotes.map((note) => (
                    <li key={note.id}>
                      <button
                        type="button"
                        onClick={() => setActiveNoteId(note.id)}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                          activeNoteId === note.id
                            ? "border-border bg-muted"
                            : "border-transparent hover:bg-muted/60",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-medium">{note.title}</p>
                          {note.isPinned ? (
                            <Pin className="size-3.5 shrink-0 fill-primary text-primary" />
                          ) : null}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {note.content.slice(0, 48)}
                          {note.content.length > 48 ? "…" : ""}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No notes match your search.
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex min-w-0 flex-1 flex-col">
          {activeNoteId ? (
            <>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPreview(!isPreview)}
                  >
                    {isPreview ? (
                      <>
                        <Edit data-icon="inline-start" />
                        Editor
                      </>
                    ) : (
                      <>
                        <Eye data-icon="inline-start" />
                        Preview
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant={isPinned ? "secondary" : "outline"}
                    onClick={() => setIsPinned(!isPinned)}
                  >
                    <Pin
                      data-icon="inline-start"
                      className={isPinned ? "fill-current" : undefined}
                    />
                    {isPinned ? "Pinned" : "Pin"}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    <Trash2 />
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading} size="sm">
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3 pt-4">
                <Input
                  placeholder="Note title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  readOnly={isPreview}
                  className="border-0 px-0 text-lg font-semibold shadow-none focus-visible:ring-0"
                />
                {isPreview ? (
                  <div className="min-h-[320px] flex-1 rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {content || (
                      <span className="text-muted-foreground italic">
                        Empty note
                      </span>
                    )}
                  </div>
                ) : (
                  <Textarea
                    placeholder="Markdown or plain text…"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[320px] flex-1 resize-none font-mono text-sm"
                  />
                )}
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-1 flex-col items-center justify-center py-16">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BookOpen />
                  </EmptyMedia>
                  <EmptyTitle>No note selected</EmptyTitle>
                  <EmptyDescription>
                    Pick a note from the list or create a new one.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={handleCreate}>Create note</Button>
                </EmptyContent>
              </Empty>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
