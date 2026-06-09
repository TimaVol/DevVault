import "server-only";

import { z } from "zod";
import { getSiteUrl as getSiteUrlFromPublic } from "@/lib/env/public";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_DATABASE_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export const env = serverEnvSchema.parse(process.env);

export { getSupabasePublicEnv } from "@/lib/env/public";

export function getSiteUrl(fallback = "http://localhost:3000"): string {
  return getSiteUrlFromPublic(fallback);
}
