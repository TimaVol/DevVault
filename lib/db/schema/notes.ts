import { boolean, index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { softDeleteColumns } from "./columns";
import { authenticatedOwnRowPolicies } from "./policies";
import { profiles } from "./profiles";

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    ...softDeleteColumns(),
  },
  (table) => [
    index("notes_user_id_idx").on(table.userId),
    index("notes_created_at_idx").on(table.createdAt),
    index("notes_is_pinned_idx").on(table.isPinned),
    ...authenticatedOwnRowPolicies("notes", table.userId),
  ],
);
