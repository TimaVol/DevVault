"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";
import { projects, projectTechStack } from "@/lib/db/schema";
import {
  actionFailure,
  actionOk,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/server/actions";
import { softDelete } from "@/server/db/soft-delete";
import { syncChildStrings } from "@/server/db/sync-child-strings";
import { revalidateEntityPaths } from "@/server/revalidation";
import { parseIdOrFail, zodFailure } from "@/server/validation/action";

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
  const parsed = insertProjectSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const newProject = await ctx.rls(async (tx) => {
      const [project] = await tx
        .insert(projects)
        .values({
          userId: ctx.user.id,
          name: parsed.data.name,
          description: parsed.data.description ?? null,
          repositoryUrl: parsed.data.repositoryUrl ?? null,
          demoUrl: parsed.data.demoUrl ?? null,
          status: parsed.data.status ?? "active",
        })
        .returning();

      await syncChildStrings({
        values: parsed.data.techStack,
        delete: () =>
          tx.delete(projectTechStack).where(eq(projectTechStack.projectId, project.id)),
        insert: (stack) =>
          tx
            .insert(projectTechStack)
            .values(stack.map((tech) => ({ projectId: project.id, tech }))),
      });

      return project;
    });

    revalidateEntityPaths("dashboard", "projects");
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
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  const parsed = updateProjectSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const { techStack: stackValues, ...projectData } = parsed.data;

    const updatedProject = await ctx.rls(async (tx) => {
      const [project] = await tx
        .update(projects)
        .set({ ...projectData, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();

      if (!project) return null;

      await syncChildStrings({
        values: stackValues,
        delete: () =>
          tx.delete(projectTechStack).where(eq(projectTechStack.projectId, id)),
        insert: (stack) =>
          tx
            .insert(projectTechStack)
            .values(stack.map((tech) => ({ projectId: id, tech }))),
      });

      return project;
    });

    if (!updatedProject) {
      return actionFailure("Project not found or unauthorized");
    }

    revalidateEntityPaths("dashboard", "projects");
    return actionSuccess({ project: updatedProject });
  });
}

export async function deleteProject(id: string) {
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  return withAuthedAction(async (ctx) => {
    const deleted = await ctx.rls((tx) => softDelete(tx, projects, id));

    if (!deleted) {
      return actionFailure("Project not found or unauthorized");
    }

    revalidateEntityPaths("dashboard", "projects");
    return actionOk();
  });
}
