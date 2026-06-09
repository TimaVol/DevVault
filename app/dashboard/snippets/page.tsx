import { SnippetsClient } from "@/features/snippets/components/snippets-client";
import { getSnippetLanguages, getSnippets } from "@/features/snippets/server/queries";
import { parseSnippetParams } from "@/features/snippets/server/params";

export default async function SnippetsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseSnippetParams(params);
  const [{ items, total, page, pageSize }, languages] = await Promise.all([
    getSnippets(filters),
    getSnippetLanguages(),
  ]);

  return (
    <SnippetsClient
      initialSnippets={items}
      languages={languages}
      pagination={{ total, page, pageSize }}
    />
  );
}
