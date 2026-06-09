"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAsyncAction } from "@/hooks/use-async-action";

type ActionResponse = { success: boolean; error?: string };

type ConfirmDeleteOptions = {
  message: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
};

type PendingDelete = {
  action: () => Promise<ActionResponse>;
  options: ConfirmDeleteOptions;
};

type ConfirmDeleteContextValue = {
  isLoading: boolean;
  confirmDelete: (
    action: () => Promise<ActionResponse>,
    options: ConfirmDeleteOptions,
  ) => void;
};

const ConfirmDeleteContext = createContext<ConfirmDeleteContextValue | null>(
  null,
);

export function ConfirmDeleteProvider({ children }: { children: ReactNode }) {
  const { isLoading, run } = useAsyncAction();
  const [pending, setPending] = useState<PendingDelete | null>(null);

  const confirmDelete = useCallback(
    (action: () => Promise<ActionResponse>, options: ConfirmDeleteOptions) => {
      setPending({ action, options });
    },
    [],
  );

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      setPending(null);
    }
  };

  const handleConfirm = async () => {
    if (!pending) return;

    const { action, options } = pending;
    await run(action, {
      successMessage: options.successMessage ?? "Deleted",
      errorMessage: options.errorMessage ?? "Delete failed",
      onSuccess: () => {
        options.onSuccess?.();
        setPending(null);
      },
    });
  };

  return (
    <ConfirmDeleteContext.Provider value={{ isLoading, confirmDelete }}>
      {children}
      <AlertDialog open={pending !== null} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.options.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isLoading}
              onClick={handleConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDeleteContext.Provider>
  );
}

export function useConfirmDelete() {
  const context = useContext(ConfirmDeleteContext);
  if (!context) {
    throw new Error("useConfirmDelete must be used within ConfirmDeleteProvider");
  }
  return context;
}
