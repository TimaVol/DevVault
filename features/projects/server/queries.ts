import "server-only";

import { desc, eq, getTableColumns, isNull, sql } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { projects, projectTechStack } from "@/lib/db/schema";

export async function getProjects() {
  const db = await requireDrizzle();

  return db.rls((tx) =>
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
}
