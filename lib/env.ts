import "server-only";

import { z } from "zod";
import {
  getSiteUrl,
  getSupabasePublicEnv,
  publicEnvSchema,
} from "@/lib/env/public";

const serverEnvSchema = publicEnvSchema.extend({
  DATABASE_URL: z.string().min(1),
  ADMIN_DATABASE_URL: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  DISABLE_SIGNUP: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

export const env = serverEnvSchema.parse(process.env);

export { getSiteUrl, getSupabasePublicEnv };
