import type { Note } from "@/features/notes/types";

const now = new Date("2024-06-15T12:00:00Z");

export function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: "note-1",
    userId: "user-1",
    title: "My Note",
    content: "Note content",
    isPinned: false,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
