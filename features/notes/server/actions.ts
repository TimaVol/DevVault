"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { notes } from "@/lib/db/schema";
import {
  actionFailure,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/server/actions";
import {
  insertWithUserId,
  runDeleteAction,
  updateEntityRow,
} from "@/server/actions/entity-mutations";
import { revalidateEntityPaths } from "@/server/revalidation";
import { parseIdOrFail, zodFailure } from "@/server/validation/action";

const insertNoteSchema = createInsertSchema(notes).omit(serverFields);
const updateNoteSchema = createUpdateSchema(notes).omit(serverFields);

const NOT_FOUND = "Note not found or unauthorized";

export async function createNote(data: z.input<typeof insertNoteSchema>) {
  const parsed = insertNoteSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const newNote = await ctx.rls((tx) =>
      insertWithUserId(tx, notes, ctx.user.id, {
        isPinned: false,
        ...parsed.data,
      }),
    );

    revalidateEntityPaths("dashboard", "notes");
    return actionSuccess({ note: newNote });
  });
}

export async function updateNote(
  id: string,
  data: z.input<typeof updateNoteSchema>,
) {
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  const parsed = updateNoteSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const updatedNote = await ctx.rls((tx) =>
      updateEntityRow(tx, notes, id, parsed.data),
    );

    if (!updatedNote) {
      return actionFailure(NOT_FOUND);
    }

    revalidateEntityPaths("dashboard", "notes");
    return actionSuccess({ note: updatedNote });
  });
}

export async function deleteNote(id: string) {
  return runDeleteAction(id, notes, {
    notFoundMessage: NOT_FOUND,
    revalidate: ["dashboard", "notes"],
  });
}
