import "server-only";

import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { requireDrizzle } from "@/server/auth/require-user";
import type { PaginatedResult } from "@/server/pagination";
import { getOffset } from "@/server/pagination";
import { projects, projectTechStack } from "@/lib/db/schema";
import type { ProjectListParams } from "./params";

function buildProjectFilters(params: ProjectListParams) {
  const conditions = [isNull(projects.deletedAt)];

  if (params.tab !== "all") {
    conditions.push(
      eq(projects.status, params.tab as "backlog" | "active" | "completed"),
    );
  }

  if (params.q) {
    const pattern = `%${params.q}%`;
    conditions.push(
      or(
        ilike(projects.name, pattern),
        ilike(projects.description, pattern),
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
  params: ProjectListParams = { tab: "all", page: 1, pageSize: 50 },
) {
  const db = await requireDrizzle();
  const where = buildProjectFilters(params);
  const offset = getOffset(params.page, params.pageSize);

  return db.rls(async (tx) => {
    const [countResult] = await tx
      .select({ value: count(sql`distinct ${projects.id}`) })
      .from(projects)
      .leftJoin(projectTechStack, eq(projects.id, projectTechStack.projectId))
      .where(where);

    const items = await tx
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
      .limit(params.pageSize)
      .offset(offset);

    return {
      items,
      total: countResult?.value ?? 0,
      page: params.page,
      pageSize: params.pageSize,
    } satisfies PaginatedResult<(typeof items)[number]>;
  });
}
