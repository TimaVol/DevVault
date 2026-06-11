import { parseBaseListParams } from "@/server/pagination";
import { ChecklistsClient } from "@/features/checklists/components/checklists-client";
import { getChecklists } from "@/features/checklists/server/queries";

export default async function ChecklistsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseBaseListParams(params);
  const { items, total, page, pageSize } = await getChecklists(filters);

  return (
    <ChecklistsClient
      initialChecklists={items}
      pagination={{ total, page, pageSize }}
    />
  );
}
