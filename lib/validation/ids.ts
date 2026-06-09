import { z } from "zod";

export const idSchema = z.uuid("Invalid id");

export function parseActionId(id: string) {
  return idSchema.safeParse(id);
}
