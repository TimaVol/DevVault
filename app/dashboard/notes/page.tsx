import { NotesClient } from "@/features/notes/components/notes-client";
import { getNoteById, getNotes } from "@/features/notes/server/queries";
import { parseNoteParams } from "@/features/notes/server/params";
import type { SearchParamsPageProps } from "@/server/queries/load-list-page";

export default async function NotesPage({ searchParams }: SearchParamsPageProps) {
  const filters = parseNoteParams(await searchParams);
  const [{ items, total, page, pageSize }, activeNoteFallback] =
    await Promise.all([
      getNotes(filters),
      filters.note ? getNoteById(filters.note) : Promise.resolve(null),
    ]);

  return (
    <NotesClient
      initialNotes={items}
      pagination={{ total, page, pageSize }}
      activeNoteFallback={activeNoteFallback}
    />
  );
}
