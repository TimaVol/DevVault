"use client";

import { useCallback } from "react";
import { useAsyncAction } from "@/hooks/use-async-action";

type ActionResponse = { success: boolean; error?: string };

type ConfirmDeleteOptions = {
  message: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
};

/**
 * Wraps a destructive server action with a window.confirm guard plus the
 * shared loading/toast handling from useAsyncAction.
 */
export function useConfirmDelete() {
  const { isLoading, run } = useAsyncAction();

  const confirmDelete = useCallback(
    (action: () => Promise<ActionResponse>, options: ConfirmDeleteOptions) => {
      if (!window.confirm(options.message)) return;
      return run(action, {
        successMessage: options.successMessage ?? "Deleted",
        errorMessage: options.errorMessage ?? "Delete failed",
        onSuccess: options.onSuccess,
      });
    },
    [run],
  );

  return { isLoading, confirmDelete };
}
