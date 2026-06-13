import { eq, type InferInsertModel } from "drizzle-orm";
import type { z } from "zod";
import type { DrizzleSupabaseContext } from "@/lib/db/create-drizzle-supabase-client";
import type { AppDbTransaction, SoftDeletableTable } from "@/lib/db/types";
import type { ActionResult } from "@/shared/action-result";
import {
  actionFailure,
  actionOk,
  actionSuccess,
  type ServerManagedKey,
  withAuthedAction,
} from "@/server/actions";
import { softDelete } from "@/server/db/soft-delete";
import {
  revalidateEntityPaths,
  type RevalidateRouteKey,
} from "@/server/revalidation";
import { parseIdOrFail, zodFailure } from "@/server/validation/action";

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

export async function runCreateAction<
  TData,
  TEntity,
  TKey extends string,
>(
  data: unknown,
  options: {
    schema: z.ZodType<TData>;
    resultKey: TKey;
    revalidate: RevalidateRouteKey[];
    mutate: (ctx: DrizzleSupabaseContext, data: TData) => Promise<TEntity>;
  },
): Promise<ActionResult<Record<TKey, TEntity>>> {
  const parsed = options.schema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const entity = await options.mutate(ctx, parsed.data);
    revalidateEntityPaths(...options.revalidate);
    return actionSuccess({ [options.resultKey]: entity } as Record<TKey, TEntity>);
  });
}

export async function runUpdateAction<
  TData,
  TEntity,
  TKey extends string,
>(
  id: string,
  data: unknown,
  options: {
    schema: z.ZodType<TData>;
    resultKey: TKey;
    revalidate: RevalidateRouteKey[];
    notFoundMessage: string;
    mutate: (
      ctx: DrizzleSupabaseContext,
      id: string,
      data: TData,
    ) => Promise<TEntity | null>;
  },
): Promise<ActionResult<Record<TKey, TEntity>>> {
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  const parsed = options.schema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const entity = await options.mutate(ctx, id, parsed.data);
    if (!entity) {
      return actionFailure(options.notFoundMessage);
    }

    revalidateEntityPaths(...options.revalidate);
    return actionSuccess({ [options.resultKey]: entity } as Record<TKey, TEntity>);
  });
}
