"use client";

import { useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { useAppShell } from "@/components/layout/app-shell-context";
import { Button } from "@/components/ui/button";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { useUrlFilters } from "@/hooks/use-url-filters";
import type { ActionResult } from "@/shared/action-result";

type UseEntityListPageOptions<T extends { id: string }> = {
  filterDefaults: Record<string, string>;
  createLabel: string;
  onDelete: (id: string) => Promise<ActionResult>;
  deleteMessage: string;
  deleteSuccessMessage: string;
};

export function useEntityListPage<T extends { id: string }>({
  filterDefaults,
  createLabel,
  onDelete,
  deleteMessage,
  deleteSuccessMessage,
}: UseEntityListPageOptions<T>) {
  const [filters, setFilter] = useUrlFilters({ defaults: filterDefaults });
  const dialog = useEntityDialog<T>();
  const { confirmDelete } = useConfirmDelete();

  const shellActions = useMemo(
    () => (
      <Button onClick={dialog.openCreate} size="sm">
        <Plus data-icon="inline-start" />
        {createLabel}
      </Button>
    ),
    [dialog.openCreate, createLabel],
  );

  useAppShell({ actions: shellActions });

  const remove = useCallback(
    (id: string) =>
      confirmDelete(() => onDelete(id), {
        message: deleteMessage,
        successMessage: deleteSuccessMessage,
      }),
    [confirmDelete, onDelete, deleteMessage, deleteSuccessMessage],
  );

  const setFilterAndResetPage = useCallback(
    (key: string, value: string) => {
      setFilter(key, value);
      setFilter("page", "1");
    },
    [setFilter],
  );

  return {
    filters,
    setFilter,
    setFilterAndResetPage,
    remove,
    ...dialog,
  };
}
