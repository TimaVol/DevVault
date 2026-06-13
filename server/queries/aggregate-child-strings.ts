import "server-only";

import {
  count,
  desc,
  eq,
  getColumns,
  sql,
  type SQL,
} from "drizzle-orm";
import type { AnyPgColumn, AnyPgTable } from "drizzle-orm/pg-core";
import type { AppDbTransaction } from "@/lib/db/types";

type CreateChildStringsListQueryConfig = {
  parentTable: AnyPgTable;
  parentIdColumn: AnyPgColumn;
  parentCreatedAtColumn: AnyPgColumn;
  childTable: AnyPgTable;
  childParentIdColumn: AnyPgColumn;
  childValueColumn: AnyPgColumn;
  aggregateKey: string;
};

type ChildStringsListQuery = {
  countDistinct: (tx: AppDbTransaction, where: SQL | undefined) => Promise<number>;
  fetchRows: <TRow>(
    tx: AppDbTransaction,
    where: SQL | undefined,
    limit: number,
    offset: number,
  ) => Promise<TRow[]>;
};

export function createChildStringsListQuery(
  config: CreateChildStringsListQueryConfig,
): ChildStringsListQuery {
  const {
    parentTable,
    parentIdColumn,
    parentCreatedAtColumn,
    childTable,
    childParentIdColumn,
    childValueColumn,
    aggregateKey,
  } = config;

  return {
    countDistinct: async (tx, where) => {
      const [countResult] = await tx
        .select({ value: count(sql`distinct ${parentIdColumn}`) })
        .from(parentTable)
        .leftJoin(childTable, eq(parentIdColumn, childParentIdColumn))
        .where(where);

      return countResult?.value ?? 0;
    },

    fetchRows: async <TRow>(
      tx: AppDbTransaction,
      where: SQL | undefined,
      limit: number,
      offset: number,
    ) => {
      const rows = await tx
        .select({
          ...getColumns(parentTable),
          [aggregateKey]: sql<string[]>`coalesce(
            array_agg(${childValueColumn}) filter (where ${childValueColumn} is not null),
            array[]::text[]
          )`,
        })
        .from(parentTable)
        .leftJoin(childTable, eq(parentIdColumn, childParentIdColumn))
        .where(where)
        .groupBy(parentIdColumn)
        .orderBy(desc(parentCreatedAtColumn))
        .limit(limit)
        .offset(offset);

      return rows as TRow[];
    },
  };
}
