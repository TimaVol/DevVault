/** Trim, drop empties, dedupe case-insensitively (preserve first casing). */
export function normalizeList(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;

    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

export function parseCommaList(input: string): string[] {
  return normalizeList(input.split(","));
}
