import { ChecklistsClient } from "@/features/checklists/components/checklists-client";
import { getChecklists } from "@/features/checklists/server/queries";

export default async function ChecklistsPage() {
  const checklists = await getChecklists();
  return <ChecklistsClient initialChecklists={checklists} />;
}
