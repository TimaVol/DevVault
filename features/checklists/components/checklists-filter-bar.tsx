"use client";

import { SearchFilterBar } from "@/components/shared/search-filter-bar";

type ChecklistsFilterBarProps = {
  search: string;
  onDebouncedSearchChange: (value: string) => void;
};

export function ChecklistsFilterBar({
  search,
  onDebouncedSearchChange,
}: ChecklistsFilterBarProps) {
  return (
    <SearchFilterBar
      placeholder="Search checklists…"
      value={search}
      onDebouncedChange={onDebouncedSearchChange}
      className="sm:max-w-xs"
    />
  );
}
