import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  prefix: "auth",
  analytics: true,
});

/** Returns true when the request is allowed, false when rate-limited. */
export async function checkRateLimit(key: string): Promise<boolean> {
  try {
    const { success } = await ratelimit.limit(key);
    return success;
  } catch (error) {
    console.error("[rate-limit] Redis check failed:", error);
    return false;
  }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return headers.get("x-real-ip") ?? "unknown";
}
