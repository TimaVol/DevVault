import { z } from "zod";

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().startsWith("G-").optional(),
  NEXT_PUBLIC_HCAPTCHA_SITE_KEY: z.string().min(1).optional(),
});

/** Supabase public vars safe to reference from edge middleware when present. */
export function getSupabasePublicEnv():
  | { url: string; anonKey: string }
  | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getSiteUrl(fallback = "http://localhost:3000"): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Vercel injects these automatically — no manual env setup needed.
  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (process.env.VERCEL_ENV === "production" && productionUrl) {
    return `https://${productionUrl}`;
  }

  const deploymentUrl = process.env.VERCEL_URL;
  if (deploymentUrl) {
    return `https://${deploymentUrl}`;
  }

  return fallback;
}

export function getGaMeasurementId(): string | null {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? null;
}
