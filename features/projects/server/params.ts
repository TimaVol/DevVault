import {
  createListParamsParser,
  parseStringParam,
} from "@/server/pagination";
import { PROJECT_FILTER_TABS } from "@/features/projects/constants";

const validProjectTabs = new Set<string>(PROJECT_FILTER_TABS);

function parseProjectTab(
  value: string | string[] | undefined,
): (typeof PROJECT_FILTER_TABS)[number] {
  const raw = parseStringParam(value) ?? "all";
  return validProjectTabs.has(raw)
    ? (raw as (typeof PROJECT_FILTER_TABS)[number])
    : "all";
}

export const parseProjectParams = createListParamsParser((sp) => ({
  tab: parseProjectTab(sp.tab),
}));

export type ProjectListParams = ReturnType<typeof parseProjectParams>;
