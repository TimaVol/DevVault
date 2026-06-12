import { redirect } from "next/navigation";
import {
  createDrizzleSupabaseClient,
  type DrizzleSupabaseContext,
} from "@/lib/db/create-drizzle-supabase-client";
import type { ActionFailure } from "@/shared/action-result";
import { ROUTES } from "@/shared/routes";

/** Server Components — redirects to login when unauthenticated */
export async function requireDrizzle(): Promise<DrizzleSupabaseContext> {
  const db = await createDrizzleSupabaseClient();
  if (!db) {
    redirect(ROUTES.login);
  }
  return db;
}

export async function requireDrizzleAction(): Promise<
  DrizzleSupabaseContext | ActionFailure
> {
  const db = await createDrizzleSupabaseClient();
  if (!db) {
    return { success: false, error: "Unauthorized" };
  }
  return db;
}
