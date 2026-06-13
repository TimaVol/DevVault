type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

/** Returns true when the request is allowed, false when rate-limited. */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count += 1;
  return true;
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return headers.get("x-real-ip") ?? "unknown";
}
