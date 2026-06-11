"use client";

import { useCallback, useState } from "react";

export function useEntityDialog<T extends { id: string }>() {
  const [open, setOpen] = useState(false);
  const [entity, setEntity] = useState<T | null>(null);

  const openCreate = useCallback(() => {
    setEntity(null);
    setOpen(true);
  }, []);

  const openEdit = useCallback((item: T) => {
    setEntity(item);
    setOpen(true);
  }, []);

  const dialogKey = entity?.id ?? "new";

  return { open, setOpen, entity, openCreate, openEdit, dialogKey };
}
