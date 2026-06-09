"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { projects, projectTechStack } from "@/lib/db/schema";
import {
  actionFailure,
  actionOk,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/lib/db/server-action";
import { ROUTES } from "@/lib/routes";
import { parseActionId } from "@/lib/validation/ids";
import { normalizeList } from "@/utils/normalize-list";

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
    return actionFailure(result.error.issues[0].message);
  }

  return withAuthedAction(async (ctx) => {
    const newProject = await ctx.rls(async (tx) => {
      const [project] = await tx
        .insert(projects)
        .values({
          userId: ctx.user.id,
          name: result.data.name,
          description: result.data.description ?? null,
          repositoryUrl: result.data.repositoryUrl ?? null,
          demoUrl: result.data.demoUrl ?? null,
          status: result.data.status ?? "active",
        })
        .returning();

      const newStack = normalizeList(result.data.techStack ?? []);
      if (newStack.length > 0) {
        await tx
          .insert(projectTechStack)
          .values(newStack.map((tech) => ({ projectId: project.id, tech })));
      }

      return project;
    });

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.projects);
    return actionSuccess({ project: newProject });
  });
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
  const idResult = parseActionId(id);
  if (!idResult.success) {
    return actionFailure(idResult.error.issues[0].message);
  }

  const result = updateProjectSchema.safeParse(data);
  if (!result.success) {
    return actionFailure(result.error.issues[0].message);
  }

  return withAuthedAction(async (ctx) => {
    const { techStack: stackValues, ...projectData } = result.data;

    const updatedProject = await ctx.rls(async (tx) => {
      const [project] = await tx
        .update(projects)
        .set({ ...projectData, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();

      if (!project) return null;

      await tx
        .delete(projectTechStack)
        .where(eq(projectTechStack.projectId, id));
      const newStack = normalizeList(stackValues ?? []);
      if (newStack.length > 0) {
        await tx
          .insert(projectTechStack)
          .values(newStack.map((tech) => ({ projectId: id, tech })));
      }

      return project;
    });

    if (!updatedProject) {
      return actionFailure("Project not found or unauthorized");
    }

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.projects);
    return actionSuccess({ project: updatedProject });
  });
}

export async function deleteProject(id: string) {
  const idResult = parseActionId(id);
  if (!idResult.success) {
    return actionFailure(idResult.error.issues[0].message);
  }

  return withAuthedAction(async (ctx) => {
    const [deleted] = await ctx.rls((tx) =>
      tx
        .update(projects)
        .set({ deletedAt: new Date() })
        .where(eq(projects.id, id))
        .returning(),
    );

    if (!deleted) {
      return actionFailure("Project not found or unauthorized");
    }

    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.projects);
    return actionOk();
  });
}
