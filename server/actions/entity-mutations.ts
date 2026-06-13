import { eq } from "drizzle-orm";
import type { AppDbTransaction } from "@/lib/db/types";
import {
  checklists,
  notes,
  projects,
  snippets,
} from "@/lib/db/schema";
import type { ActionResult } from "@/shared/action-result";
import {
  actionFailure,
  actionOk,
  withAuthedAction,
} from "@/server/actions";
import { softDelete } from "@/server/db/soft-delete";
import {
  revalidateEntityPaths,
  type RevalidateRouteKey,
} from "@/server/revalidation";
import { parseIdOrFail } from "@/server/validation/action";

type SoftDeletableTable =
  | typeof notes
  | typeof projects
  | typeof snippets
  | typeof checklists;

type UpdatableTable = SoftDeletableTable;

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

export async function updateEntityRow(
  tx: AppDbTransaction,
  table: UpdatableTable,
  id: string,
  data: Record<string, unknown>,
) {
  const rows = await tx
    .update(table)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(table.id, id))
    .returning();

  return rows[0] ?? null;
}
