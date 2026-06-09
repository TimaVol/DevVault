import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { SnippetsClient } from "@/features/snippets/components/snippets-client";
import { getSnippets } from "@/features/snippets/server/queries";

export default async function SnippetsPage() {
  const snippets = await getSnippets();
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SnippetsClient initialSnippets={snippets} />
    </Suspense>
  );
}
