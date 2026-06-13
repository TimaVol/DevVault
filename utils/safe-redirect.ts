/**
 * Validates a post-auth redirect target. Only same-origin relative paths are allowed.
 */
export function safeRelativePath(
  path: string | null | undefined,
  fallback: string,
): string {
  if (!path) return fallback;

  const trimmed = path.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  if (trimmed.includes("@") || trimmed.includes("\\")) {
    return fallback;
  }

  try {
    const decoded = decodeURIComponent(trimmed);
    if (
      decoded.startsWith("//") ||
      decoded.includes("@") ||
      decoded.includes("\\")
    ) {
      return fallback;
    }
  } catch {
    return fallback;
  }

  return trimmed;
}
