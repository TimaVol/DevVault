import { NotesClient } from "@/features/notes/components/notes-client";
import { getNotes } from "@/features/notes/server/queries";

export default async function NotesPage() {
  const notes = await getNotes();
  return <NotesClient initialNotes={notes} />;
}
