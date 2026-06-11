export function getUserInitial(email: string | null | undefined): string {
  return email?.charAt(0).toUpperCase() ?? "U";
}

export function getUserDisplayName(email: string | null | undefined): string {
  return email?.split("@")[0] ?? "User";
}
