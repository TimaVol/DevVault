import { SnippetsClient } from "@/features/snippets/components/snippets-client";
import { getSnippets } from "@/features/snippets/server/queries";

export default async function SnippetsPage() {
  const snippets = await getSnippets();
  return <SnippetsClient initialSnippets={snippets} />;
}
