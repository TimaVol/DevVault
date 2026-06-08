export const PROJECT_STATUSES = [
  { value: "backlog", label: "Backlog" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
] as const;

/** Filter tabs include an "all" pseudo-status in addition to the real statuses. */
export const PROJECT_FILTER_TABS = [
  "all",
  ...PROJECT_STATUSES.map((s) => s.value),
] as const;
