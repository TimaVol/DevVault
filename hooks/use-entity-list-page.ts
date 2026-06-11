"use client";

import { useCallback } from "react";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { useUrlFilters } from "@/hooks/use-url-filters";
import type { ActionResult } from "@/shared/action-result";

type UseEntityListPageOptions<T extends { id: string }> = {
  filterDefaults: Record<string, string>;
  onDelete: (id: string) => Promise<ActionResult>;
  deleteMessage: string;
  deleteSuccessMessage: string;
};

export function useEntityListPage<T extends { id: string }>({
  filterDefaults,
  onDelete,
  deleteMessage,
  deleteSuccessMessage,
}: UseEntityListPageOptions<T>) {
  const [filters, setFilter] = useUrlFilters({ defaults: filterDefaults });
  const dialog = useEntityDialog<T>();
  const { confirmDelete } = useConfirmDelete();

  const remove = useCallback(
    (id: string) =>
      confirmDelete(() => onDelete(id), {
        message: deleteMessage,
        successMessage: deleteSuccessMessage,
      }),
    [confirmDelete, onDelete, deleteMessage, deleteSuccessMessage],
  );

  return {
    filters,
    setFilter,
    remove,
    ...dialog,
  };
}
