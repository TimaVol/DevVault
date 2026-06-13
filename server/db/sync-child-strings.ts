import { eq, type InferInsertModel } from "drizzle-orm";
import type { AnyPgColumn, AnyPgTable } from "drizzle-orm/pg-core";
import type { AppDbTransaction } from "@/lib/db/types";
import { normalizeList } from "@/utils/normalize-list";

type SyncChildStringsOptions = {
  values: string[] | undefined;
  delete: () => Promise<unknown>;
  insert: (normalized: string[]) => Promise<unknown>;
};

async function syncChildStrings({
  values,
  delete: deleteRows,
  insert,
}: SyncChildStringsOptions) {
  await deleteRows();
  const normalized = normalizeList(values ?? []);
  if (normalized.length > 0) {
    await insert(normalized);
  }
}

type ChildStringSyncerConfig<TChildTable extends AnyPgTable> = {
  childTable: TChildTable;
  parentIdColumn: AnyPgColumn;
  buildRow: (parentId: string, value: string) => InferInsertModel<TChildTable>;
};

export function createChildStringSyncer<TChildTable extends AnyPgTable>(
  config: ChildStringSyncerConfig<TChildTable>,
) {
  return async (
    tx: AppDbTransaction,
    parentId: string,
    values: string[] | undefined,
  ) => {
    await syncChildStrings({
      values,
      delete: () =>
        tx.delete(config.childTable).where(eq(config.parentIdColumn, parentId)),
      insert: (normalized) =>
        tx.insert(config.childTable).values(
          normalized.map((value) => config.buildRow(parentId, value)),
        ),
    });
  };
}
