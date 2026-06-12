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
});

export const env = serverEnvSchema.parse(process.env);

export { getSiteUrl, getSupabasePublicEnv };
