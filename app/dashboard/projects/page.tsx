import { ProjectsClient } from "@/features/projects/components/projects-client";
import { getProjects } from "@/features/projects/server/queries";
import { parseProjectParams } from "@/features/projects/server/params";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseProjectParams(params);
  const { items, total, page, pageSize } = await getProjects(filters);

  return (
    <ProjectsClient
      initialProjects={items}
      pagination={{ total, page, pageSize }}
    />
  );
}
