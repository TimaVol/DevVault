import { timestamp } from "drizzle-orm/pg-core";

export function timestampColumns() {
  return {
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  };
}

export function softDeleteColumns() {
  return {
    ...timestampColumns(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  };
}
