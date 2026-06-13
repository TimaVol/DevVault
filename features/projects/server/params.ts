import {
  createListParamsParser,
  parseStringParam,
} from "@/server/pagination";

export const parseProjectParams = createListParamsParser((sp) => ({
  tab: parseStringParam(sp.tab) ?? "all",
}));

export type ProjectListParams = ReturnType<typeof parseProjectParams>;
