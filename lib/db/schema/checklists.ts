import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { softDeleteColumns, timestampColumns } from "./columns";
import {
  authenticatedOwnRowPolicies,
  authenticatedViaParentPolicies,
  ownsViaParent,
} from "./policies";
import { profiles } from "./profiles";

export const checklists = pgTable(
  "checklists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    ...softDeleteColumns(),
  },
  (table) => [
    index("checklists_user_id_idx").on(table.userId),
    index("checklists_created_at_idx").on(table.createdAt),
    ...authenticatedOwnRowPolicies("checklists", table.userId),
  ],
);

export const checklistItems = pgTable(
  "checklist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    checklistId: uuid("checklist_id")
      .notNull()
      .references(() => checklists.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
    position: integer("position").default(0).notNull(),
    ...timestampColumns(),
  },
  (table) => {
    const ownsChecklist = ownsViaParent(
      checklists,
      checklists.id,
      table.checklistId,
      checklists.userId,
    );

    return [
      index("checklist_items_checklist_id_idx").on(table.checklistId),
      unique("checklist_items_checklist_id_position_unique").on(
        table.checklistId,
        table.position,
      ),
      ...authenticatedViaParentPolicies("checklist_items", ownsChecklist, {
        update: true,
      }),
    ];
  },
);
