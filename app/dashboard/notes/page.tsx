import { NotesClient } from "@/features/notes/components/notes-client";
import { getNoteById, getNotes } from "@/features/notes/server/queries";
import { parseNoteParams } from "@/features/notes/server/params";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseNoteParams(params);

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
