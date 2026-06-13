"use client";

import { useCallback } from "react";
import { useAsyncAction } from "@/hooks/use-async-action";
import type { ActionResult } from "@/shared/action-result";

type UseEntityFormSubmitOptions = {
  isEditing: boolean;
  onOpenChange: (open: boolean) => void;
  reset: () => void;
  createMessage: string;
  updateMessage: string;
  errorMessage?: string;
};

export function useEntityFormSubmit({
  isEditing,
  onOpenChange,
  reset,
  createMessage,
  updateMessage,
  errorMessage,
}: UseEntityFormSubmitOptions) {
  const { isLoading, run } = useAsyncAction();

  const submit = useCallback(
    async (action: () => Promise<ActionResult>) => {
      await run(action, {
        successMessage: isEditing ? updateMessage : createMessage,
        errorMessage,
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      });
    },
    [
      run,
      isEditing,
      updateMessage,
      createMessage,
      errorMessage,
      reset,
      onOpenChange,
    ],
  );

  return { isLoading, submit };
}
