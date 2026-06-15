export function getUserInitial(
  email: string | null | undefined,
  options?: { isDemo?: boolean },
): string {
  if (options?.isDemo) return "D";
  return email?.charAt(0).toUpperCase() ?? "U";
}

export function getUserDisplayName(
  email: string | null | undefined,
  options?: { isDemo?: boolean },
): string {
  if (options?.isDemo) return "Demo";
  return email?.split("@")[0] ?? "User";
}
