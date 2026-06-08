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
import { useAsyncAction } from "@/hooks/use-async-action";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { createNote, deleteNote, updateNote } from "@/features/notes/server/actions";
import type { Note } from "@/features/notes/types";
import { NoteEditor } from "./note-editor";
import { NotesSidebar } from "./notes-sidebar";

export function NotesClient({ initialNotes }: { initialNotes: Note[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    initialNotes.length > 0 ? initialNotes[0].id : null,
  );
  const { isLoading: isSaving, run } = useAsyncAction();
  const { isLoading: isDeleting, confirmDelete } = useConfirmDelete();
  const isLoading = isSaving || isDeleting;

  const activeNote = initialNotes.find((n) => n.id === activeNoteId);

  const handleCreate = async () => {
    const res = await run(
      () =>
        createNote({
          title: "Untitled Note",
          content: "Write down your daily dev log or technical task description...",
          isPinned: false,
        }),
      { successMessage: "New note created", errorMessage: "Failed to create note" },
    );
    if (res && "note" in res && res.note) {
      setActiveNoteId(res.note.id);
    }
  };

  const handleSave = async (data: { title: string; content: string; isPinned: boolean }) => {
    if (!activeNoteId) return;
    if (!data.title.trim()) {
      toast.error("Note title is required");
      return;
    }
    await run(() => updateNote(activeNoteId, data), {
      successMessage: "Note saved",
      errorMessage: "Failed to save note",
    });
  };

  const handleDelete = () => {
    if (!activeNoteId) return;
    confirmDelete(() => deleteNote(activeNoteId), {
      message: "Delete this note?",
      successMessage: "Note deleted",
      errorMessage: "Failed to delete note",
      onSuccess: () => {
        const remaining = initialNotes.filter((n) => n.id !== activeNoteId);
        setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
      },
    });
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
