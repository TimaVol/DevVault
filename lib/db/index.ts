import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

export { createDrizzle } from "./create-drizzle";
export type { DrizzleRLSClient, SupabaseToken } from "./create-drizzle";
export type { AppDatabase, AppDbTransaction } from "./types";
import type { AppDatabase } from "./types";

const clientUrl = env.DATABASE_URL;
const adminUrl = env.ADMIN_DATABASE_URL ?? env.DATABASE_URL;

if (!adminUrl) {
  throw new Error(
    "ADMIN_DATABASE_URL or DATABASE_URL must be set for admin/migrations",
  );
}

const drizzleConfig = {
  schema,
  casing: "snake_case" as const,
};

const clientSql = postgres(clientUrl, { prepare: false });
const adminSql = postgres(adminUrl, { prepare: false });

/** RLS-scoped pool — use only inside `.rls()` transactions */
export const client: AppDatabase = drizzle({
  client: clientSql,
  ...drizzleConfig,
});

/** Bypasses RLS — migrations and trusted server operations only */
export const admin: AppDatabase = drizzle({
  client: adminSql,
  ...drizzleConfig,
});
