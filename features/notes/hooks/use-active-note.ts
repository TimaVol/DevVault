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
  return useMemo(() => {
    const resolveNote = (id: string) =>
      notes.find((note) => note.id === id) ??
      (activeNoteFallback?.id === id ? activeNoteFallback : null) ??
      (pendingNote?.id === id ? pendingNote : null);

    const activeNote =
      (noteIdFromUrl ? resolveNote(noteIdFromUrl) : null) ??
      notes[0] ??
      pendingNote ??
      null;

    return {
      resolvedActiveNoteId: activeNote?.id ?? null,
      activeNote,
    };
  }, [noteIdFromUrl, notes, activeNoteFallback, pendingNote]);
}
