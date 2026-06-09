"use client";

import { DebouncedSearchInput } from "@/components/layout/debounced-search-input";

type ChecklistsFilterBarProps = {
  search: string;
  onDebouncedSearchChange: (value: string) => void;
};

export function ChecklistsFilterBar({
  search,
  onDebouncedSearchChange,
}: ChecklistsFilterBarProps) {
  return (
    <DebouncedSearchInput
      placeholder="Search checklists…"
      value={search}
      onDebouncedChange={onDebouncedSearchChange}
      className="sm:max-w-xs"
    />
  );
}
