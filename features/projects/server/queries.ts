import "server-only";

import { and, eq, or, sql } from "drizzle-orm";
import { createChildStringsListQuery } from "@/server/queries/aggregate-child-strings";
import { paginatedList } from "@/server/queries/paginated-list";
import { ilikeAny, notDeleted } from "@/server/queries/filters";
import { projects, projectTechStack } from "@/lib/db/schema";
import type { ProjectListParams } from "./params";

type ProjectRow = typeof projects.$inferSelect & { techStack: string[] };

const projectListQuery = createChildStringsListQuery({
  parentTable: projects,
  parentIdColumn: projects.id,
  parentCreatedAtColumn: projects.createdAt,
  childTable: projectTechStack,
  childParentIdColumn: projectTechStack.projectId,
  childValueColumn: projectTechStack.tech,
  aggregateKey: "techStack",
});

function buildProjectFilters(params: ProjectListParams) {
  const conditions = [notDeleted(projects)];

  if (params.tab !== "all") {
    conditions.push(eq(projects.status, params.tab));
  }

  if (params.q) {
    const pattern = `%${params.q}%`;
    conditions.push(
      or(
        ilikeAny(pattern, projects.name, projects.description),
        sql`exists (
          select 1 from ${projectTechStack}
          where ${projectTechStack.projectId} = ${projects.id}
          and ${projectTechStack.tech} ilike ${pattern}
        )`,
      )!,
    );
  }

  return and(...conditions);
}

export async function getProjects(
  params: ProjectListParams = { q: undefined, tab: "all", page: 1, pageSize: 50 },
) {
  const where = buildProjectFilters(params);

  return paginatedList<ProjectRow>({
    params,
    countRows: (tx) => projectListQuery.countDistinct(tx, where),
    fetchRows: (tx, limit, offset) =>
      projectListQuery.fetchRows<ProjectRow>(tx, where, limit, offset),
  });
}
