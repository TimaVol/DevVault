import { z } from "zod";
import { LIMITS } from "@/server/validation/limits";

export const titleField = z
  .string()
  .min(1, "Title is required")
  .max(LIMITS.title, `Title must be at most ${LIMITS.title} characters`);

export const nameField = z
  .string()
  .min(1, "Name is required")
  .max(LIMITS.name, `Name must be at most ${LIMITS.name} characters`);

export const descriptionField = z
  .string()
  .max(
    LIMITS.description,
    `Description must be at most ${LIMITS.description} characters`,
  )
  .optional()
  .nullable();

export const contentField = z
  .string()
  .max(
    LIMITS.content,
    `Content must be at most ${LIMITS.content} characters`,
  );

export const tagsField = z
  .array(
    z
      .string()
      .max(LIMITS.tag, `Each tag must be at most ${LIMITS.tag} characters`),
  )
  .max(LIMITS.tags, `At most ${LIMITS.tags} tags allowed`)
  .optional();

export const techStackField = z
  .array(
    z
      .string()
      .max(LIMITS.tag, `Each item must be at most ${LIMITS.tag} characters`),
  )
  .max(LIMITS.techStack, `At most ${LIMITS.techStack} items allowed`)
  .optional();

export const checklistItemsField = z
  .array(
    z
      .string()
      .min(1, "Item cannot be empty")
      .max(
        LIMITS.checklistItem,
        `Each item must be at most ${LIMITS.checklistItem} characters`,
      ),
  )
  .min(1, "At least one item required")
  .max(LIMITS.checklistItems, `At most ${LIMITS.checklistItems} items allowed`);

export const optionalChecklistItemsField = checklistItemsField.optional();
