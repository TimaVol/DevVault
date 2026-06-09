import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { ProjectsClient } from "@/features/projects/components/projects-client";
import { getProjects } from "@/features/projects/server/queries";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProjectsClient initialProjects={projects} />
    </Suspense>
  );
}
