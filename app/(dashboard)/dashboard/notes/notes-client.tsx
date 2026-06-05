"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getErrorMessage } from "@/utils/errors";
import { createNote, deleteNote, updateNote } from "./actions";
import { NoteEditor } from "./note-editor";
import { NotesSidebar } from "./notes-sidebar";

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
  const [isLoading, setIsLoading] = useState(false);

  const activeNote = initialNotes.find((n) => n.id === activeNoteId);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const res = await createNote({
        title: "Untitled Note",
        content: "Write down your daily dev log or technical task description...",
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

  const handleSave = async (data: { title: string; content: string; isPinned: boolean }) => {
    if (!activeNoteId) return;
    if (!data.title.trim()) {
      toast.error("Note title is required");
      return;
    }
    setIsLoading(true);
    try {
      const res = await updateNote(activeNoteId, data);
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
        <NotesSidebar
          notes={sortedNotes}
          searchQuery={searchQuery}
          activeNoteId={activeNoteId}
          onSearchChange={setSearchQuery}
          onSelectNote={setActiveNoteId}
        />

        {activeNoteId && activeNote ? (
          <NoteEditor
            key={activeNoteId}
            initialTitle={activeNote.title}
            initialContent={activeNote.content}
            initialIsPinned={activeNote.isPinned}
            isLoading={isLoading}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ) : (
          <Card className="flex min-w-0 flex-1 flex-col">
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
          </Card>
        )}
      </div>
    </div>
  );
}
