import type { ActionFailure, ActionSuccess } from "@/lib/action-result";

export function actionFailure(error: string): ActionFailure {
  return { success: false, error };
}

export function actionSuccess<T extends Record<string, unknown>>(
  data: T,
): ActionSuccess<T> {
  return { success: true, ...data } as ActionSuccess<T>;
}

export function actionOk(): ActionSuccess {
  return { success: true };
}
