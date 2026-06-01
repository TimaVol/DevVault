import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export { createDrizzle } from "./create-drizzle";
export type { DrizzleRLSClient, SupabaseToken } from "./create-drizzle";
export type { AppDatabase, AppDbTransaction } from "./types";
import type { AppDatabase } from "./types";

const clientUrl = process.env.DATABASE_URL;
const adminUrl =
  process.env.ADMIN_DATABASE_URL ?? process.env.DATABASE_URL;

if (!clientUrl) {
  throw new Error("DATABASE_URL is not set");
}

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

/**
 * @deprecated Use `createDrizzleSupabaseClient()` + `.rls()` or `admin` explicitly.
 */
export const db = admin;
