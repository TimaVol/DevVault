import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { NotesClient } from "@/features/notes/components/notes-client";
import { getNotes } from "@/features/notes/server/queries";
import { parseNoteParams } from "@/features/notes/server/params";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseNoteParams(params);
  const notes = await getNotes(filters);

  return (
    <Suspense fallback={<PageSkeleton />}>
      <NotesClient initialNotes={notes} />
    </Suspense>
  );
}
