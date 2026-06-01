import React from "react";
import { desc } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { notes } from "@/lib/db/schema";
import { NotesClient } from "./notes-client";

export default async function NotesPage() {
  const db = await requireDrizzle();

  const userNotes = await db.rls((tx) =>
    tx.select().from(notes).orderBy(desc(notes.createdAt)),
  );

  return <NotesClient initialNotes={userNotes} />;
}
