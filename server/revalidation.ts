import { revalidatePath } from "next/cache";
import { ROUTES } from "@/shared/routes";

type RouteKey = keyof typeof ROUTES;

export function revalidateEntityPaths(...keys: RouteKey[]) {
  for (const key of keys) {
    revalidatePath(ROUTES[key]);
  }
}
