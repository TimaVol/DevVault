import {
  createListParamsParser,
  parseStringParam,
} from "@/server/pagination";

export const parseSnippetParams = createListParamsParser((sp) => ({
  lang: parseStringParam(sp.lang) ?? "all",
}));

export type SnippetListParams = ReturnType<typeof parseSnippetParams>;
