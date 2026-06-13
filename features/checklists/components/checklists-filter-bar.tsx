"use client";

import { DebouncedSearchInput } from "@/components/shared/debounced-search-input";
import { ListFilterBar } from "@/components/shared/list-filter-bar";

type ChecklistsFilterBarProps = {
  search: string;
  onDebouncedSearchChange: (value: string) => void;
};

export function ChecklistsFilterBar({
  search,
  onDebouncedSearchChange,
}: ChecklistsFilterBarProps) {
  return (
    <ListFilterBar>
      <DebouncedSearchInput
        placeholder="Search checklists…"
        value={search}
        onDebouncedChange={onDebouncedSearchChange}
        className="sm:max-w-xs"
      />
    </ListFilterBar>
  );
}
