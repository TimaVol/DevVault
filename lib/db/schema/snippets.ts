import { boolean, index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { softDeleteColumns } from "./columns";
import { authenticatedOwnRowPolicies } from "./policies";
import { profiles } from "./profiles";

export const snippets = pgTable(
  "snippets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    language: text("language").default("javascript").notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    ...softDeleteColumns(),
  },
  (table) => [
    index("snippets_user_id_idx").on(table.userId),
    index("snippets_created_at_idx").on(table.createdAt),
    index("snippets_is_pinned_idx").on(table.isPinned),
    ...authenticatedOwnRowPolicies("snippets", table.userId),
  ],
);
