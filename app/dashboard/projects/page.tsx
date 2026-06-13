import { ProjectsClient } from "@/features/projects/components/projects-client";
import { getProjects } from "@/features/projects/server/queries";
import { parseProjectParams } from "@/features/projects/server/params";
import {
  loadPaginatedPage,
  type SearchParamsPageProps,
} from "@/server/queries/load-list-page";

export default async function ProjectsPage({ searchParams }: SearchParamsPageProps) {
  const { items, total, page, pageSize } = await loadPaginatedPage(
    searchParams,
    parseProjectParams,
    getProjects,
  );

  return (
    <ProjectsClient
      initialProjects={items}
      pagination={{ total, page, pageSize }}
    />
  );
}
