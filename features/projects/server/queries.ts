import "server-only";

import { and, desc, eq, or } from "drizzle-orm";
import { createChildStringsListQuery } from "@/server/queries/aggregate-child-strings";
import { paginatedList } from "@/server/queries/paginated-list";
import {
  childStringIlikeExists,
  notDeleted,
  textSearchCondition,
} from "@/server/queries/filters";
import { defaultListParams } from "@/server/pagination";
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

  const textSearch = textSearchCondition(
    params.q,
    projects.name,
    projects.description,
  );
  if (textSearch) {
    const pattern = `%${params.q}%`;
    conditions.push(
      or(
        textSearch,
        childStringIlikeExists(
          projectTechStack,
          projectTechStack.projectId,
          projectTechStack.tech,
          projects.id,
          pattern,
        ),
      )!,
    );
  }

  return and(...conditions);
}

export async function getProjects(
  params: ProjectListParams = defaultListParams({ tab: "all" }),
) {
  const where = buildProjectFilters(params);

  return paginatedList<ProjectRow>({
    params,
    countRows: (tx) => projectListQuery.countDistinct(tx, where),
    fetchRows: (tx, limit, offset) =>
      projectListQuery.fetchRows<ProjectRow>(tx, where, limit, offset),
  });
}
