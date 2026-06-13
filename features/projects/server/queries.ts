import "server-only";

import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  or,
  sql,
} from "drizzle-orm";
import { paginatedList } from "@/server/queries/paginated-list";
import { ilikeAny, notDeleted } from "@/server/queries/filters";
import { projects, projectTechStack } from "@/lib/db/schema";
import type { AppDbTransaction } from "@/lib/db/types";
import type { ProjectListParams } from "./params";

function buildProjectFilters(params: ProjectListParams) {
  const conditions = [notDeleted(projects)];

  if (params.tab !== "all") {
    conditions.push(
      eq(projects.status, params.tab as "backlog" | "active" | "completed"),
    );
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

async function fetchProjectRows(
  tx: AppDbTransaction,
  where: ReturnType<typeof buildProjectFilters>,
  limit: number,
  offset: number,
) {
  return tx
    .select({
      ...getTableColumns(projects),
      techStack: sql<string[]>`coalesce(
        array_agg(${projectTechStack.tech}) filter (where ${projectTechStack.tech} is not null),
        array[]::text[]
      )`,
    })
    .from(projects)
    .leftJoin(projectTechStack, eq(projects.id, projectTechStack.projectId))
    .where(where)
    .groupBy(projects.id)
    .orderBy(desc(projects.createdAt))
    .limit(limit)
    .offset(offset);
}

async function countDistinctProjects(
  tx: AppDbTransaction,
  where: ReturnType<typeof buildProjectFilters>,
) {
  const [countResult] = await tx
    .select({ value: count(sql`distinct ${projects.id}`) })
    .from(projects)
    .leftJoin(projectTechStack, eq(projects.id, projectTechStack.projectId))
    .where(where);
  return countResult?.value ?? 0;
}

export async function getProjects(
  params: ProjectListParams = { q: undefined, tab: "all", page: 1, pageSize: 50 },
) {
  const where = buildProjectFilters(params);

  return paginatedList({
    params,
    countRows: (tx) => countDistinctProjects(tx, where),
    fetchRows: (tx, limit, offset) => fetchProjectRows(tx, where, limit, offset),
  });
}
