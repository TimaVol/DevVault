"use client";

import { useMemo } from "react";
import type { Note } from "@/features/notes/types";

type UseActiveNoteOptions = {
  noteIdFromUrl: string;
  notes: Note[];
  activeNoteFallback?: Note | null;
  pendingNote: Note | null;
};

export function useActiveNote({
  noteIdFromUrl,
  notes,
  activeNoteFallback = null,
  pendingNote,
}: UseActiveNoteOptions) {
  const resolvedActiveNoteId = useMemo(() => {
    if (noteIdFromUrl) {
      if (notes.some((note) => note.id === noteIdFromUrl)) {
        return noteIdFromUrl;
      }
      if (activeNoteFallback?.id === noteIdFromUrl) {
        return noteIdFromUrl;
      }
      if (pendingNote?.id === noteIdFromUrl) {
        return noteIdFromUrl;
      }
    }
    return notes[0]?.id ?? pendingNote?.id ?? null;
  }, [noteIdFromUrl, notes, activeNoteFallback, pendingNote]);

  const activeNote =
    notes.find((note) => note.id === resolvedActiveNoteId) ??
    (activeNoteFallback?.id === resolvedActiveNoteId ? activeNoteFallback : undefined) ??
    (pendingNote?.id === resolvedActiveNoteId ? pendingNote : undefined);

  return { resolvedActiveNoteId, activeNote };
}
