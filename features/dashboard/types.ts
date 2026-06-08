import type { getDashboardOverview } from "./server/queries";

export type DashboardOverview = Awaited<ReturnType<typeof getDashboardOverview>>;
