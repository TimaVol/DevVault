import { eq, type InferInsertModel } from "drizzle-orm";
import type { AppDbTransaction, SoftDeletableTable } from "@/lib/db/types";
import type { ActionResult } from "@/shared/action-result";
import {
  actionFailure,
  actionOk,
  type ServerManagedKey,
  withAuthedAction,
} from "@/server/actions";
import { softDelete } from "@/server/db/soft-delete";
import {
  revalidateEntityPaths,
  type RevalidateRouteKey,
} from "@/server/revalidation";
import { parseIdOrFail } from "@/server/validation/action";

type EntityRow<T extends SoftDeletableTable> = T["$inferSelect"];

type EntityInsertData<T extends SoftDeletableTable> = Omit<
  InferInsertModel<T>,
  ServerManagedKey
>;

type EntityUpdateData<T extends SoftDeletableTable> = Partial<
  EntityInsertData<T>
>;

export async function insertWithUserId<T extends SoftDeletableTable>(
  tx: AppDbTransaction,
  table: T,
  userId: string,
  data: EntityInsertData<T>,
): Promise<EntityRow<T>> {
  const rows = await tx
    .insert(table)
    .values({ ...data, userId } as InferInsertModel<T>)
    .returning();

  return rows[0] as EntityRow<T>;
}

export async function runDeleteAction(
  id: string,
  table: SoftDeletableTable,
  options: {
    notFoundMessage: string;
    revalidate: RevalidateRouteKey[];
  },
): Promise<ActionResult> {
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  return withAuthedAction(async (ctx) => {
    const deleted = await ctx.rls((tx) => softDelete(tx, table, id));

    if (!deleted) {
      return actionFailure(options.notFoundMessage);
    }

    revalidateEntityPaths(...options.revalidate);
    return actionOk();
  });
}

export async function updateEntityRow<T extends SoftDeletableTable>(
  tx: AppDbTransaction,
  table: T,
  id: string,
  data: EntityUpdateData<T>,
): Promise<EntityRow<T> | null> {
  const rows = (await tx
    .update(table)
    .set({ ...data, updatedAt: new Date() } as never)
    .where(eq(table.id, id))
    .returning()) as EntityRow<T>[];

  return rows[0] ?? null;
}
