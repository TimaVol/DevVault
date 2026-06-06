import React from "react";
import { desc, eq, getTableColumns, isNull, sql } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { projects, projectTechStack } from "@/lib/db/schema";
import { ProjectsClient } from "./projects-client";

export default async function ProjectsPage() {
  const db = await requireDrizzle();

  const userProjects = await db.rls((tx) =>
    tx
      .select({
        ...getTableColumns(projects),
        techStack: sql<string[]>`coalesce(
          array_agg(${projectTechStack.tech}) filter (where ${projectTechStack.tech} is not null),
          array[]::text[]
        )`,
      })
      .from(projects)
      .leftJoin(
        projectTechStack,
        eq(projects.id, projectTechStack.projectId),
      )
      .where(isNull(projects.deletedAt))
      .groupBy(projects.id)
      .orderBy(desc(projects.createdAt)),
  );

  return <ProjectsClient initialProjects={userProjects} />;
}
