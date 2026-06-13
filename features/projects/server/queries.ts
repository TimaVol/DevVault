import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { createChildStringsListQuery } from "@/server/queries/aggregate-child-strings";
import { paginatedList } from "@/server/queries/paginated-list";
import {
  notDeleted,
  textSearchWithChildStrings,
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

  const textSearch = textSearchWithChildStrings(
    params.q,
    {
      childTable: projectTechStack,
      childParentIdCol: projectTechStack.projectId,
      childValueCol: projectTechStack.tech,
      parentIdCol: projects.id,
    },
    projects.name,
    projects.description,
  );
  if (textSearch) {
    conditions.push(textSearch);
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
