import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "./schema";

export type SupabaseToken = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  email?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  role?: string;
};

export type AppDatabase = PostgresJsDatabase<typeof schema>;
export type AppDbTransaction = Parameters<
  Parameters<AppDatabase["transaction"]>[0]
>[0];
