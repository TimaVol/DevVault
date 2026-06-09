import { z } from "zod";

/** Supabase public vars safe to reference from edge middleware when present. */
export function getSupabasePublicEnv():
  | { url: string; anonKey: string }
  | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function parsePublicEnv(): PublicEnv {
  return publicEnvSchema.parse(process.env);
}

export function getSiteUrl(fallback = "http://localhost:3000"): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) {
    return url;
  }
  return fallback;
}
