import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "./schema";

export type AppDatabase = PostgresJsDatabase<typeof schema>;
export type AppDbTransaction = Parameters<
  Parameters<AppDatabase["transaction"]>[0]
>[0];
