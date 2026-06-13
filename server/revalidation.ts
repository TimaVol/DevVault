import { revalidatePath } from "next/cache";
import { ROUTES } from "@/shared/routes";

export type RevalidateRouteKey = keyof typeof ROUTES;

export function revalidateEntityPaths(...keys: RevalidateRouteKey[]) {
  for (const key of keys) {
    revalidatePath(ROUTES[key]);
  }
}
