"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookOpen, Plus } from "lucide-react";
import { useAppShell } from "@/components/layout/app-shell-context";
import { ListEmptyState } from "@/components/layout/list-empty-state";
import { Button } from "@/components/ui/button";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { isActionSuccess } from "@/shared/action-result";
import { createNote, deleteNote, updateNote } from "@/features/notes/server/actions";
import type { Note } from "@/features/notes/types";
import { NoteEditor } from "./note-editor";
import { NotesSidebar } from "./notes-sidebar";

const NOTE_FILTER_DEFAULTS = { q: "", note: "", page: "1" };

type NotesClientProps = {
  initialNotes: Note[];
  pagination: { total: number; page: number; pageSize: number };
  activeNoteFallback?: Note | null;
};

export function NotesClient({
  initialNotes,
  pagination,
  activeNoteFallback = null,
}: NotesClientProps) {
  const router = useRouter();
  const [filters, setFilter] = useUrlFilters({ defaults: NOTE_FILTER_DEFAULTS });
  const [pendingNote, setPendingNote] = useState<Note | null>(null);
  const { isLoading: isSaving, run } = useAsyncAction();
  const { isLoading: isDeleting, confirmDelete } = useConfirmDelete();
  const isLoading = isSaving || isDeleting;

  const resolvedActiveNoteId = useMemo(() => {
    if (filters.note) {
      if (initialNotes.some((note) => note.id === filters.note)) {
        return filters.note;
      }
      if (activeNoteFallback?.id === filters.note) {
        return filters.note;
      }
      if (pendingNote?.id === filters.note) {
        return filters.note;
      }
    }
    return initialNotes[0]?.id ?? pendingNote?.id ?? null;
  }, [filters.note, initialNotes, activeNoteFallback, pendingNote]);

  const activeNote =
    initialNotes.find((note) => note.id === resolvedActiveNoteId) ??
    (activeNoteFallback?.id === resolvedActiveNoteId ? activeNoteFallback : undefined) ??
    (pendingNote?.id === resolvedActiveNoteId ? pendingNote : undefined);

  const handleCreate = useCallback(async () => {
    const res = await run(
      () =>
        createNote({
          title: "Untitled Note",
          content: "Write down your daily dev log or technical task description...",
          isPinned: false,
        }),
      { successMessage: "New note created", errorMessage: "Failed to create note" },
    );
    if (isActionSuccess(res) && res.note) {
      setPendingNote(res.note);
      setFilter("note", res.note.id);
    }
  }, [run, setFilter]);

  const handleSave = async (data: { title: string; content: string; isPinned: boolean }) => {
    if (!resolvedActiveNoteId) return;
    if (!data.title.trim()) {
      toast.error("Note title is required");
      return;
    }
    await run(() => updateNote(resolvedActiveNoteId, data), {
      successMessage: "Note saved",
      errorMessage: "Failed to save note",
    });
  };

  const handleAutoSave = async (data: {
    title: string;
    content: string;
    isPinned: boolean;
  }) => {
    if (!resolvedActiveNoteId || !data.title.trim()) return;
    await run(() => updateNote(resolvedActiveNoteId, data), {
      refresh: false,
      errorMessage: "Autosave failed",
    });
  };

  const handleDelete = () => {
    if (!resolvedActiveNoteId) return;
    confirmDelete(() => deleteNote(resolvedActiveNoteId), {
      message: "Delete this note?",
      successMessage: "Note deleted",
      errorMessage: "Failed to delete note",
      onSuccess: () => {
        setFilter("note", "");
        router.refresh();
      },
    });
  };

  const shellActions = useMemo(
    () => (
      <Button onClick={handleCreate} disabled={isLoading} size="sm">
        <Plus data-icon="inline-start" />
        New Note
      </Button>
    ),
    [handleCreate, isLoading],
  );

  useAppShell({ title: "Notes", actions: shellActions });

  return (
    <div className="-mx-4 -my-6 flex min-h-[calc(100dvh-4rem)] flex-col overflow-hidden md:-mx-10 md:-my-8 md:flex-row">
      <NotesSidebar
        notes={initialNotes}
        searchQuery={filters.q}
        activeNoteId={resolvedActiveNoteId}
        pagination={pagination}
        onDebouncedSearchChange={(value) => {
          setFilter("q", value);
          setFilter("page", "1");
        }}
        onSelectNote={(id) => setFilter("note", id)}
        onPageChange={(page) => setFilter("page", String(page))}
      />

      {resolvedActiveNoteId && activeNote ? (
        <NoteEditor
          key={resolvedActiveNoteId}
          initialTitle={activeNote.title}
          initialContent={activeNote.content}
          initialIsPinned={activeNote.isPinned}
          isLoading={isLoading}
          onSave={handleSave}
          onAutoSave={handleAutoSave}
          onDelete={handleDelete}
        />
      ) : (
        <div className="flex min-w-0 flex-1 items-center justify-center border-l border-border bg-background p-8">
          <ListEmptyState
            icon={BookOpen}
            title="No note selected"
            description="Pick a note from the list or create a new one."
            actionLabel="Create note"
            onAction={handleCreate}
            showActionIcon={false}
          />
        </div>
      )}
    </div>
  );
}
