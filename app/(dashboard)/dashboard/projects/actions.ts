"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  isUnauthorized,
  requireDrizzleAction,
} from "@/lib/auth/require-user";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/errors";

const serverFields = {
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

const urlField = z
  .string()
  .url("Invalid URL")
  .nullish()
  .or(z.literal(""))
  .transform((v) => v || null);

const techStackField = z.array(z.string()).optional();

const insertProjectSchema = createInsertSchema(projects)
  .omit(serverFields)
  .extend({
    repositoryUrl: urlField,
    demoUrl: urlField,
    techStack: techStackField,
  });

const updateProjectSchema = createUpdateSchema(projects)
  .omit(serverFields)
  .extend({
    repositoryUrl: urlField,
    demoUrl: urlField,
    techStack: techStackField,
  });

export async function createProject(data: {
  name: string;
  description?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  status: string;
  techStack?: string[];
}) {
  const result = insertProjectSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

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
          name: result.data.name,
          description: result.data.description ?? null,
          repositoryUrl: result.data.repositoryUrl ?? null,
          demoUrl: result.data.demoUrl ?? null,
          status: result.data.status ?? "active",
          techStack: result.data.techStack ?? [],
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
  const result = updateProjectSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const ctx = await requireDrizzleAction();
  if (isUnauthorized(ctx)) {
    return ctx;
  }

  try {
    const [updatedProject] = await ctx.rls((tx) =>
      tx
        .update(projects)
        .set({
          ...result.data,
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
