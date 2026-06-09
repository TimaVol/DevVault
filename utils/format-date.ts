const formatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(date: Date | string): string {
  return formatter.format(new Date(date));
}
