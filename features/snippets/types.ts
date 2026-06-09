import type { getSnippets } from "./server/queries";

export type Snippet = Awaited<ReturnType<typeof getSnippets>>["items"][number];
