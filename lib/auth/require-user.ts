import { redirect } from "next/navigation";
import {
  createDrizzleSupabaseClient,
  type DrizzleSupabaseContext,
} from "@/lib/db/server";

/** Server Components — redirects to login when unauthenticated */
export async function requireDrizzle(): Promise<DrizzleSupabaseContext> {
  const db = await createDrizzleSupabaseClient();
  if (!db) {
    redirect("/login");
  }
  return db;
}

/** Server Actions — returns null instead of redirecting */
export async function getDrizzleOrNull(): Promise<DrizzleSupabaseContext | null> {
  return createDrizzleSupabaseClient();
}

export async function requireDrizzleAction(): Promise<
  DrizzleSupabaseContext | { success: false; error: string }
> {
  const db = await createDrizzleSupabaseClient();
  if (!db) {
    return { success: false, error: "Unauthorized" };
  }
  return db;
}

export function isUnauthorized<T>(
  result: T | { success: false; error: string },
): result is { success: false; error: string } {
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    result.success === false
  );
}
