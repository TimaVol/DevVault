export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

/** Surface Postgres / postgres.js error details in dev. */
export function getPgErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as {
      message?: string;
      cause?: { message?: string; code?: string };
      code?: string;
    };
    const code = e.code ?? e.cause?.code;
    const detail = e.cause?.message ?? e.message;
    if (code && detail) return `${detail} (code: ${code})`;
    if (detail) return detail;
  }
  return getErrorMessage(err);
}
