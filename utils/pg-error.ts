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
    if (code && detail) {
      return `${detail} (code: ${code})`;
    }
    if (detail) {
      return detail;
    }
  }
  return err instanceof Error ? err.message : String(err);
}
