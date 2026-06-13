import { ChecklistsClient } from "@/features/checklists/components/checklists-client";
import { parseChecklistParams } from "@/features/checklists/server/params";
import { getChecklists } from "@/features/checklists/server/queries";
import {
  loadPaginatedPage,
  type SearchParamsPageProps,
} from "@/server/queries/load-list-page";

export default async function ChecklistsPage({ searchParams }: SearchParamsPageProps) {
  const { items, total, page, pageSize } = await loadPaginatedPage(
    searchParams,
    parseChecklistParams,
    getChecklists,
  );

  return (
    <ChecklistsClient
      initialChecklists={items}
      pagination={{ total, page, pageSize }}
    />
  );
}
