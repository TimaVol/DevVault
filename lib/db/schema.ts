import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgPolicy,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
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
    isPinned: boolean("is_pinned").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("snippets_user_id_idx").on(table.userId),
    index("snippets_created_at_idx").on(table.createdAt),
    index("snippets_is_pinned_idx").on(table.isPinned),
    ...authenticatedOwnRowPolicies("snippets", table.userId),
  ],
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
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("projects_user_id_idx").on(table.userId),
    index("projects_created_at_idx").on(table.createdAt),
    index("projects_status_idx").on(table.status),
    ...authenticatedOwnRowPolicies("projects", table.userId),
  ],
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
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
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
      index("checklist_items_checklist_id_idx").on(table.checklistId),
      unique("checklist_items_checklist_id_position_unique").on(
        table.checklistId,
        table.position,
      ),
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
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("notes_user_id_idx").on(table.userId),
    index("notes_created_at_idx").on(table.createdAt),
    index("notes_is_pinned_idx").on(table.isPinned),
    ...authenticatedOwnRowPolicies("notes", table.userId),
  ],
);

export const snippetTags = pgTable(
  "snippet_tags",
  {
    snippetId: uuid("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => {
    const ownsSnippet = sql`exists (
      select 1 from ${snippets}
      where ${snippets.id} = ${table.snippetId}
      and ${snippets.userId} = (select auth.uid())
    )`;

    return [
      primaryKey({ columns: [table.snippetId, table.tag] }),
      index("snippet_tags_tag_idx").on(table.tag),
      pgPolicy("snippet_tags select own", {
        for: "select",
        to: authenticatedRole,
        using: ownsSnippet,
      }),
      pgPolicy("snippet_tags insert own", {
        for: "insert",
        to: authenticatedRole,
        withCheck: ownsSnippet,
      }),
      pgPolicy("snippet_tags delete own", {
        for: "delete",
        to: authenticatedRole,
        using: ownsSnippet,
      }),
    ];
  },
);

export const projectTechStack = pgTable(
  "project_tech_stack",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    tech: text("tech").notNull(),
  },
  (table) => {
    const ownsProject = sql`exists (
      select 1 from ${projects}
      where ${projects.id} = ${table.projectId}
      and ${projects.userId} = (select auth.uid())
    )`;

    return [
      primaryKey({ columns: [table.projectId, table.tech] }),
      index("project_tech_stack_tech_idx").on(table.tech),
      pgPolicy("project_tech_stack select own", {
        for: "select",
        to: authenticatedRole,
        using: ownsProject,
      }),
      pgPolicy("project_tech_stack insert own", {
        for: "insert",
        to: authenticatedRole,
        withCheck: ownsProject,
      }),
      pgPolicy("project_tech_stack delete own", {
        for: "delete",
        to: authenticatedRole,
        using: ownsProject,
      }),
    ];
  },
);
