import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { ChecklistsClient } from "@/features/checklists/components/checklists-client";
import { getChecklists } from "@/features/checklists/server/queries";
import { parseChecklistParams } from "@/features/checklists/server/params";

export default async function ChecklistsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseChecklistParams(params);
  const checklists = await getChecklists(filters);

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ChecklistsClient initialChecklists={checklists} />
    </Suspense>
  );
}
