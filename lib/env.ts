import "server-only";

import { headers } from "next/headers";
import { z } from "zod";
import {
  getSiteUrl,
  getSupabasePublicEnv,
  publicEnvSchema,
} from "@/lib/env/public";

const serverEnvSchema = publicEnvSchema.extend({
  DATABASE_URL: z.string().min(1),
  ADMIN_DATABASE_URL: z.string().min(1),
  DISABLE_SIGNUP: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

export const env = serverEnvSchema.parse(process.env);

/** Redirect origin for OAuth/email — uses the live request host on Vercel. */
export async function getRequestSiteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  if (host && !host.startsWith("localhost")) {
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }

  return getSiteUrl();
}

export { getSiteUrl, getSupabasePublicEnv };
