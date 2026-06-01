"use server";

import { projects, projectStatusEnum } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];

function parseProjectStatus(status: string): ProjectStatus {
  if (
    status === "backlog" ||
    status === "active" ||
    status === "completed"
  ) {
    return status;
  }
  return "active";
}
import {
  isUnauthorized,
  requireDrizzleAction,
} from "@/lib/auth/require-user";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/errors";

export async function createProject(data: {
  name: string;
  description?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  status: string;
  techStack?: string[];
}) {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const [newProject] = await ctx.rls((tx) =>
      tx
        .insert(projects)
        .values({
          userId: ctx.user.id,
          name: data.name,
          description: data.description || null,
          repositoryUrl: data.repositoryUrl || null,
          demoUrl: data.demoUrl || null,
          status: parseProjectStatus(data.status || "active"),
          techStack: data.techStack || [],
        })
        .returning(),
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { success: true, project: newProject };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
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
  },
) {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const { status, ...rest } = data;
    const [updatedProject] = await ctx.rls((tx) =>
      tx
        .update(projects)
        .set({
          ...rest,
          ...(status !== undefined
            ? { status: parseProjectStatus(status) }
            : {}),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning(),
    );

    if (!updatedProject) {
      return { success: false, error: "Project not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { success: true, project: updatedProject };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteProject(id: string) {
  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const [deleted] = await ctx.rls((tx) =>
      tx.delete(projects).where(eq(projects.id, id)).returning(),
    );

    if (!deleted) {
      return { success: false, error: "Project not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
