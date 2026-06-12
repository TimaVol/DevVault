import { ilike, isNull, or, type Column } from "drizzle-orm";

type SoftDeletable = { deletedAt: Column };

export function notDeleted<T extends SoftDeletable>(table: T) {
  return isNull(table.deletedAt);
}

export function ilikeAny(pattern: string, ...columns: Column[]) {
  return or(...columns.map((column) => ilike(column, pattern)))!;
}
