import React from "react";
import { desc } from "drizzle-orm";
import { requireDrizzle } from "@/lib/auth/require-user";
import { projects } from "@/lib/db/schema";
import { ProjectsClient } from "./projects-client";

export default async function ProjectsPage() {
  const db = await requireDrizzle();

  const userProjects = await db.rls((tx) =>
    tx.select().from(projects).orderBy(desc(projects.createdAt)),
  );

  return <ProjectsClient initialProjects={userProjects} />;
}
