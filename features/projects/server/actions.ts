"use server";

import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { projects, projectTechStack } from "@/lib/db/schema";
import { serverFields } from "@/server/actions";
import {
  descriptionField,
  nameField,
  techStackField,
} from "@/server/validation/fields";
import {
  insertWithUserId,
  runCreateAction,
  runDeleteAction,
  runUpdateAction,
  updateEntityRow,
} from "@/server/actions/entity-mutations";
import { createChildStringSyncer } from "@/server/db/sync-child-strings";
import { LIMITS } from "@/server/validation/limits";

const urlField = z
  .string()
  .url("Invalid URL")
  .max(LIMITS.description)
  .nullish()
  .or(z.literal(""))
  .transform((v) => v || null);

const insertProjectSchema = createInsertSchema(projects)
  .omit(serverFields)
  .extend({
    name: nameField,
    description: descriptionField,
    repositoryUrl: urlField,
    demoUrl: urlField,
    techStack: techStackField,
  });

const updateProjectSchema = createUpdateSchema(projects)
  .omit(serverFields)
  .extend({
    name: nameField.optional(),
    description: descriptionField,
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
  return runCreateAction(data, {
    schema: insertProjectSchema,
    resultKey: "project",
    revalidate: ["dashboard", "projects"],
    mutate: (ctx, parsed) => {
      const { techStack, ...projectData } = parsed;

      return ctx.rls(async (tx) => {
        const project = await insertWithUserId(tx, projects, ctx.user.id, {
          status: "active",
          ...projectData,
        });

        await syncProjectTechStack(tx, project.id, techStack);

        return project;
      });
    },
  });
}

export async function updateProject(
  id: string,
  data: z.input<typeof updateProjectSchema>,
) {
  return runUpdateAction(id, data, {
    schema: updateProjectSchema,
    resultKey: "project",
    revalidate: ["dashboard", "projects"],
    notFoundMessage: NOT_FOUND,
    mutate: (ctx, entityId, parsed) => {
      const { techStack: stackValues, ...projectData } = parsed;

      return ctx.rls(async (tx) => {
        const project = await updateEntityRow(tx, projects, entityId, projectData);
        if (!project) return null;

        await syncProjectTechStack(tx, entityId, stackValues);

        return project;
      });
    },
  });
}

export async function deleteProject(id: string) {
  return runDeleteAction(id, projects, {
    notFoundMessage: NOT_FOUND,
    revalidate: ["dashboard", "projects"],
  });
}
