import { pgSchema, uuid } from "drizzle-orm/pg-core";

/** Stub for FK to Supabase `auth.users` (table is managed by Supabase Auth). */
const authSchema = pgSchema("auth");

export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});
