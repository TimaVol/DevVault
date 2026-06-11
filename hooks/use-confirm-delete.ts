"use client";

import { createContext, useContext } from "react";
import type { ActionResult } from "@/shared/action-result";

export type ConfirmDeleteOptions = {
  message: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
};

export type ConfirmDeleteContextValue = {
  isLoading: boolean;
  confirmDelete: (
    action: () => Promise<ActionResult>,
    options: ConfirmDeleteOptions,
  ) => void;
};

export const ConfirmDeleteContext = createContext<ConfirmDeleteContextValue | null>(
  null,
);

export function useConfirmDelete() {
  const context = useContext(ConfirmDeleteContext);
  if (!context) {
    throw new Error("useConfirmDelete must be used within ConfirmDeleteProvider");
  }
  return context;
}
