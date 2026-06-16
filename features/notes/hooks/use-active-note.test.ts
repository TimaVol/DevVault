import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useActiveNote } from "./use-active-note";
import { makeNote } from "@/test/fixtures/note";

describe("useActiveNote", () => {
  const notes = [
    makeNote({ id: "note-1", title: "First" }),
    makeNote({ id: "note-2", title: "Second" }),
  ];

  it("resolves note from url id", () => {
    const { result } = renderHook(() =>
      useActiveNote({
        noteIdFromUrl: "note-2",
        notes,
        pendingNote: null,
      }),
    );

    expect(result.current.resolvedActiveNoteId).toBe("note-2");
    expect(result.current.activeNote?.title).toBe("Second");
  });

  it("falls back to first note when url id missing", () => {
    const { result } = renderHook(() =>
      useActiveNote({
        noteIdFromUrl: "",
        notes,
        pendingNote: null,
      }),
    );

    expect(result.current.activeNote?.id).toBe("note-1");
  });

  it("uses activeNoteFallback when note not in list", () => {
    const fallback = makeNote({ id: "note-3", title: "Fallback" });

    const { result } = renderHook(() =>
      useActiveNote({
        noteIdFromUrl: "note-3",
        notes,
        activeNoteFallback: fallback,
        pendingNote: null,
      }),
    );

    expect(result.current.activeNote?.title).toBe("Fallback");
  });

  it("uses pending note when list is empty", () => {
    const pending = makeNote({ id: "pending-1", title: "Pending" });

    const { result } = renderHook(() =>
      useActiveNote({
        noteIdFromUrl: "",
        notes: [],
        pendingNote: pending,
      }),
    );

    expect(result.current.activeNote?.title).toBe("Pending");
  });
});
