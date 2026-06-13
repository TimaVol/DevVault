import { ilike, isNull, or, sql, type Column } from "drizzle-orm";
import type { AnyPgColumn, AnyPgTable } from "drizzle-orm/pg-core";

type SoftDeletable = { deletedAt: Column };

export function notDeleted<T extends SoftDeletable>(table: T) {
  return isNull(table.deletedAt);
}

export function ilikeAny(pattern: string, ...columns: Column[]) {
  return or(...columns.map((column) => ilike(column, pattern)))!;
}

export function textSearchCondition(q: string | undefined, ...columns: Column[]) {
  if (!q) return undefined;
  return ilikeAny(`%${q}%`, ...columns);
}

export function childStringIlikeExists(
  childTable: AnyPgTable,
  childParentIdCol: AnyPgColumn,
  childValueCol: AnyPgColumn,
  parentIdCol: AnyPgColumn,
  pattern: string,
) {
  return sql`exists (
    select 1 from ${childTable}
    where ${childParentIdCol} = ${parentIdCol}
    and ${childValueCol} ilike ${pattern}
  )`;
}

type ChildStringSearchConfig = {
  childTable: AnyPgTable;
  childParentIdCol: AnyPgColumn;
  childValueCol: AnyPgColumn;
  parentIdCol: AnyPgColumn;
};

export function textSearchWithChildStrings(
  q: string | undefined,
  childConfig: ChildStringSearchConfig,
  ...parentColumns: Column[]
) {
  const textSearch = textSearchCondition(q, ...parentColumns);
  if (!textSearch || !q) return undefined;

  return or(
    textSearch,
    childStringIlikeExists(
      childConfig.childTable,
      childConfig.childParentIdCol,
      childConfig.childValueCol,
      childConfig.parentIdCol,
      `%${q}%`,
    ),
  )!;
}
