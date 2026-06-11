import { normalizeList } from "@/utils/normalize-list";

type SyncChildStringsOptions = {
  values: string[] | undefined;
  delete: () => Promise<unknown>;
  insert: (normalized: string[]) => Promise<unknown>;
};

export async function syncChildStrings({
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
