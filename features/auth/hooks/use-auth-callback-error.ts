"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { getAuthCallbackErrorMessage } from "@/shared/auth-errors";

export function useAuthCallbackError(callbackError: string | undefined) {
  useEffect(() => {
    const message = getAuthCallbackErrorMessage(callbackError);
    if (message) {
      toast.error(message);
    }
  }, [callbackError]);
}
