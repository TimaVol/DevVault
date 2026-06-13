"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { notes } from "@/lib/db/schema";
import { serverFields } from "@/server/actions";
import {
  contentField,
  titleField,
} from "@/server/validation/fields";
import {
  insertWithUserId,
  runCreateAction,
  runDeleteAction,
  runUpdateAction,
  updateEntityRow,
} from "@/server/actions/entity-mutations";

const insertNoteSchema = createInsertSchema(notes)
  .omit(serverFields)
  .extend({
    title: titleField,
    content: contentField,
  });
const updateNoteSchema = createUpdateSchema(notes)
  .omit(serverFields)
  .extend({
    title: titleField.optional(),
    content: contentField.optional(),
  });

const NOT_FOUND = "Note not found or unauthorized";

export async function createNote(data: z.input<typeof insertNoteSchema>) {
  return runCreateAction(data, {
    schema: insertNoteSchema,
    resultKey: "note",
    revalidate: ["dashboard", "notes"],
    mutate: (ctx, parsed) =>
      ctx.rls((tx) =>
        insertWithUserId(tx, notes, ctx.user.id, {
          isPinned: false,
          ...parsed,
        }),
      ),
  });
}

export async function updateNote(
  id: string,
  data: z.input<typeof updateNoteSchema>,
) {
  return runUpdateAction(id, data, {
    schema: updateNoteSchema,
    resultKey: "note",
    revalidate: ["dashboard", "notes"],
    notFoundMessage: NOT_FOUND,
    mutate: (ctx, entityId, parsed) =>
      ctx.rls((tx) => updateEntityRow(tx, notes, entityId, parsed)),
  });
}

export async function deleteNote(id: string) {
  return runDeleteAction(id, notes, {
    notFoundMessage: NOT_FOUND,
    revalidate: ["dashboard", "notes"],
  });
}
