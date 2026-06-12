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
import { requireDrizzle } from "@/server/auth/require-user";
import { getOffset } from "@/server/pagination";
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

export async function getProjects(
  params: ProjectListParams = { tab: "all", page: 1, pageSize: 50 },
) {
  const db = await requireDrizzle();
  const where = buildProjectFilters(params);
  const offset = getOffset(params.page, params.pageSize);

  return db.rls(async (tx) => {
    const [total, items] = await Promise.all([
      countDistinctProjects(tx, where),
      fetchProjectRows(tx, where, params.pageSize, offset),
    ]);

    return { items, total, page: params.page, pageSize: params.pageSize };
  });
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
