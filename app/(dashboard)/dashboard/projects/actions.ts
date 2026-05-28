"use server";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProject(data: {
  name: string;
  description?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  status: string;
  techStack?: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [newProject] = await db
      .insert(projects)
      .values({
        userId: user.id,
        name: data.name,
        description: data.description || null,
        repositoryUrl: data.repositoryUrl || null,
        demoUrl: data.demoUrl || null,
        status: data.status || "active",
        techStack: data.techStack || [],
      })
      .returning();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { success: true, project: newProject };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    repositoryUrl?: string;
    demoUrl?: string;
    status?: string;
    techStack?: string[];
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updatedProject] = await db
      .update(projects)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.userId, user.id)))
      .returning();

    if (!updatedProject) {
      return { success: false, error: "Project not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { success: true, project: updatedProject };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [deleted] = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, user.id)))
      .returning();

    if (!deleted) {
      return { success: false, error: "Project not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
