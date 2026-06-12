import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { softDeleteColumns } from "./columns";
import {
  authenticatedOwnRowPolicies,
  authenticatedViaParentPolicies,
  ownsViaParent,
} from "./policies";
import { profiles } from "./profiles";

export const projectStatusEnum = pgEnum("project_status", [
  "backlog",
  "active",
  "completed",
]);

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
    ...softDeleteColumns(),
  },
  (table) => [
    index("projects_user_id_idx").on(table.userId),
    index("projects_created_at_idx").on(table.createdAt),
    index("projects_status_idx").on(table.status),
    ...authenticatedOwnRowPolicies("projects", table.userId),
  ],
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
    const ownsProject = ownsViaParent(
      projects,
      projects.id,
      table.projectId,
      projects.userId,
    );

    return [
      primaryKey({ columns: [table.projectId, table.tech] }),
      index("project_tech_stack_tech_idx").on(table.tech),
      ...authenticatedViaParentPolicies("project_tech_stack", ownsProject),
    ];
  },
);
