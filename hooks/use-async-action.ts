"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errors";

type ActionResponse = { success: boolean; error?: string };

type RunOptions<R> = {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (result: R) => void;
};

/**
 * Centralizes the loading + try/catch + toast flow shared by every client
 * component that calls a server action. Returns the action result so callers
 * can read extra fields (e.g. the created row), or undefined when it threw.
 */
export function useAsyncAction() {
  const [isLoading, setIsLoading] = useState(false);

  const run = useCallback(
    async <R extends ActionResponse>(
      action: () => Promise<R>,
      options?: RunOptions<R>,
    ): Promise<R | undefined> => {
      setIsLoading(true);
      try {
        const result = await action();
        if (result.success) {
          if (options?.successMessage) toast.success(options.successMessage);
          options?.onSuccess?.(result);
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
    [],
  );

  return { isLoading, run };
}
