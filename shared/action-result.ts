export type ActionFailure = { success: false; error: string };

export type ActionSuccess<T extends Record<string, unknown> | void = void> =
  T extends void ? { success: true } : { success: true } & T;

export type ActionResult<T extends Record<string, unknown> | void = void> =
  ActionSuccess<T> | ActionFailure;

export function isActionFailure(result: ActionResult): result is ActionFailure {
  return result.success === false;
}

export function isActionSuccess<T extends Record<string, unknown> | void>(
  result: ActionResult<T> | undefined,
): result is ActionSuccess<T> {
  return result?.success === true;
}

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
