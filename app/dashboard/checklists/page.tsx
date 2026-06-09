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
  const { items, total, page, pageSize } = await getChecklists(filters);

  return (
    <ChecklistsClient
      initialChecklists={items}
      pagination={{ total, page, pageSize }}
    />
  );
}
