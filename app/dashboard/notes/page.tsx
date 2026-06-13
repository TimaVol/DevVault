import { NotesClient } from "@/features/notes/components/notes-client";
import { getNoteById, getNotes } from "@/features/notes/server/queries";
import { parseNoteParams } from "@/features/notes/server/params";
import {
  loadPaginatedPage,
  type SearchParamsPageProps,
} from "@/server/queries/load-list-page";

export default async function NotesPage({ searchParams }: SearchParamsPageProps) {
  const { items, total, page, pageSize, extra: activeNoteFallback } =
    await loadPaginatedPage(
      searchParams,
      parseNoteParams,
      getNotes,
      (filters) =>
        filters.note ? getNoteById(filters.note) : Promise.resolve(null),
    );

  return (
    <NotesClient
      initialNotes={items}
      pagination={{ total, page, pageSize }}
      activeNoteFallback={activeNoteFallback}
    />
  );
}
