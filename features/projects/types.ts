import type { getProjects } from "./server/queries";

export type Project = Awaited<ReturnType<typeof getProjects>>[number];
