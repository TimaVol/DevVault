import { SnippetsClient } from "@/features/snippets/components/snippets-client";
import { getSnippetLanguages, getSnippets } from "@/features/snippets/server/queries";
import { parseSnippetParams } from "@/features/snippets/server/params";
import {
  loadPaginatedPage,
  type SearchParamsPageProps,
} from "@/server/queries/load-list-page";

export default async function SnippetsPage({ searchParams }: SearchParamsPageProps) {
  const { items, total, page, pageSize } = await loadPaginatedPage(
    searchParams,
    parseSnippetParams,
    getSnippets,
  );
  const languages = await getSnippetLanguages();

  return (
    <SnippetsClient
      initialSnippets={items}
      languages={languages}
      pagination={{ total, page, pageSize }}
    />
  );
}
