"use client";

import { useCallback, useState } from "react";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { useUrlFilters } from "@/hooks/use-url-filters";
import type { ActionResult } from "@/shared/action-result";

type UseEntityListPageOptions = {
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
}: UseEntityListPageOptions) {
  const [filters, setFilter] = useUrlFilters({ defaults: filterDefaults });
  const [open, setOpen] = useState(false);
  const [entity, setEntity] = useState<T | null>(null);
  const { confirmDelete } = useConfirmDelete();

  const openCreate = useCallback(() => {
    setEntity(null);
    setOpen(true);
  }, []);

  const openEdit = useCallback((item: T) => {
    setEntity(item);
    setOpen(true);
  }, []);

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
    open,
    setOpen,
    entity,
    openCreate,
    openEdit,
    dialogKey: entity?.id ?? "new",
    remove,
  };
}
