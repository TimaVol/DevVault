import { ProjectsClient } from "@/features/projects/components/projects-client";
import { getProjects } from "@/features/projects/server/queries";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsClient initialProjects={projects} />;
}
