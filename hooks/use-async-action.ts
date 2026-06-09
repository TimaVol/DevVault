"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/action-result";
import { getErrorMessage } from "@/utils/errors";

type RunOptions<R> = {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (result: R) => void;
  /** Re-fetch server props after success. Defaults to true. */
  refresh?: boolean;
};

/**
 * Centralizes the loading + try/catch + toast flow shared by every client
 * component that calls a server action. Returns the action result so callers
 * can read extra fields (e.g. the created row), or undefined when it threw.
 */
export function useAsyncAction() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const run = useCallback(
    async <T extends Record<string, unknown> | void = void>(
      action: () => Promise<ActionResult<T>>,
      options?: RunOptions<ActionResult<T>>,
    ): Promise<ActionResult<T> | undefined> => {
      setIsLoading(true);
      try {
        const result = await action();
        if (result.success) {
          if (options?.successMessage) toast.success(options.successMessage);
          options?.onSuccess?.(result);
          if (options?.refresh !== false) {
            router.refresh();
          }
        } else {
          toast.error(
            result.error || options?.errorMessage || "Something went wrong",
          );
        }
        return result;
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return { isLoading, run };
}
