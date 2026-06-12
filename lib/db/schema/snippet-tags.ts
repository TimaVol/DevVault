import { index, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import {
  authenticatedViaParentPolicies,
  ownsViaParent,
} from "./policies";
import { snippets } from "./snippets";

export const snippetTags = pgTable(
  "snippet_tags",
  {
    snippetId: uuid("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => {
    const ownsSnippet = ownsViaParent(
      snippets,
      snippets.id,
      table.snippetId,
      snippets.userId,
    );

    return [
      primaryKey({ columns: [table.snippetId, table.tag] }),
      index("snippet_tags_tag_idx").on(table.tag),
      ...authenticatedViaParentPolicies("snippet_tags", ownsSnippet),
    ];
  },
);
