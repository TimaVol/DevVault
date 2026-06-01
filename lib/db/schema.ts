import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgPolicy,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import {
  authenticatedRole,
  supabaseAuthAdminRole,
} from "drizzle-orm/supabase";

/** Stub for FK to Supabase `auth.users` (table is managed by Supabase Auth). */
const authSchema = pgSchema("auth");
const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

/**
 * RLS policies are defined below and applied via createDrizzleSupabaseClient().rls().
 * profiles.id aligns with auth.users.id (see drizzle/0002_profile_auth_sync.sql).
 */

export const projectStatusEnum = pgEnum("project_status", [
  "backlog",
  "active",
  "completed",
]);

function authenticatedOwnRowPolicies(
  tableLabel: string,
  userIdColumn: AnyPgColumn,
) {
  const ownsRow = sql`(select auth.uid()) = ${userIdColumn}`;

  return [
    pgPolicy(`${tableLabel} select own`, {
      for: "select",
      to: authenticatedRole,
      using: ownsRow,
    }),
    pgPolicy(`${tableLabel} insert own`, {
      for: "insert",
      to: authenticatedRole,
      withCheck: ownsRow,
    }),
    pgPolicy(`${tableLabel} update own`, {
      for: "update",
      to: authenticatedRole,
      using: ownsRow,
      withCheck: ownsRow,
    }),
    pgPolicy(`${tableLabel} delete own`, {
      for: "delete",
      to: authenticatedRole,
      using: ownsRow,
    }),
  ];
}

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    fullName: text("full_name"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    pgPolicy("profiles select own", {
      for: "select",
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${table.id}`,
    }),
    pgPolicy("profiles update own", {
      for: "update",
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${table.id}`,
      withCheck: sql`(select auth.uid()) = ${table.id}`,
    }),
    pgPolicy("profiles insert auth admin", {
      for: "insert",
      to: supabaseAuthAdminRole,
      withCheck: sql`true`,
    }),
  ],
);

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
    tags: text("tags").array(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => authenticatedOwnRowPolicies("snippets", table.userId),
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    repositoryUrl: text("repository_url"),
    demoUrl: text("demo_url"),
    status: projectStatusEnum("status").default("active").notNull(),
    techStack: text("tech_stack").array(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => authenticatedOwnRowPolicies("projects", table.userId),
);

export const checklists = pgTable(
  "checklists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => authenticatedOwnRowPolicies("checklists", table.userId),
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
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    const ownsChecklist = sql`exists (
      select 1 from ${checklists}
      where ${checklists.id} = ${table.checklistId}
      and ${checklists.userId} = (select auth.uid())
    )`;

    return [
      pgPolicy("checklist_items select own", {
        for: "select",
        to: authenticatedRole,
        using: ownsChecklist,
      }),
      pgPolicy("checklist_items insert own", {
        for: "insert",
        to: authenticatedRole,
        withCheck: ownsChecklist,
      }),
      pgPolicy("checklist_items update own", {
        for: "update",
        to: authenticatedRole,
        using: ownsChecklist,
        withCheck: ownsChecklist,
      }),
      pgPolicy("checklist_items delete own", {
        for: "delete",
        to: authenticatedRole,
        using: ownsChecklist,
      }),
    ];
  },
);

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
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => authenticatedOwnRowPolicies("notes", table.userId),
);
