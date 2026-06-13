"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { projects, projectTechStack } from "@/lib/db/schema";
import {
  actionFailure,
  actionSuccess,
  serverFields,
  withAuthedAction,
} from "@/server/actions";
import {
  insertWithUserId,
  runDeleteAction,
  updateEntityRow,
} from "@/server/actions/entity-mutations";
import { createChildStringSyncer } from "@/server/db/sync-child-strings";
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

const syncProjectTechStack = createChildStringSyncer({
  childTable: projectTechStack,
  parentIdColumn: projectTechStack.projectId,
  buildRow: (projectId, tech) => ({ projectId, tech }),
});

const NOT_FOUND = "Project not found or unauthorized";

export async function createProject(data: z.input<typeof insertProjectSchema>) {
  const parsed = insertProjectSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const { techStack, ...projectData } = parsed.data;

    const newProject = await ctx.rls(async (tx) => {
      const project = await insertWithUserId(tx, projects, ctx.user.id, {
        status: "active",
        ...projectData,
      });

      await syncProjectTechStack(tx, project.id, techStack);

      return project;
    });

    revalidateEntityPaths("dashboard", "projects");
    return actionSuccess({ project: newProject });
  });
}

export async function updateProject(
  id: string,
  data: z.input<typeof updateProjectSchema>,
) {
  const idError = parseIdOrFail(id);
  if (idError) return idError;

  const parsed = updateProjectSchema.safeParse(data);
  if (!parsed.success) return zodFailure(parsed);

  return withAuthedAction(async (ctx) => {
    const { techStack: stackValues, ...projectData } = parsed.data;

    const updatedProject = await ctx.rls(async (tx) => {
      const project = await updateEntityRow(tx, projects, id, projectData);
      if (!project) return null;

      await syncProjectTechStack(tx, id, stackValues);

      return project;
    });

    if (!updatedProject) {
      return actionFailure(NOT_FOUND);
    }

    revalidateEntityPaths("dashboard", "projects");
    return actionSuccess({ project: updatedProject });
  });
}

export async function deleteProject(id: string) {
  return runDeleteAction(id, projects, {
    notFoundMessage: NOT_FOUND,
    revalidate: ["dashboard", "projects"],
  });
}
