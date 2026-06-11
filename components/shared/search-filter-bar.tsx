"use client";

import { DebouncedSearchInput } from "@/components/shared/debounced-search-input";
import { ListFilterBar } from "@/components/shared/list-filter-bar";

type SearchFilterBarProps = {
  value: string;
  placeholder: string;
  onDebouncedChange: (value: string) => void;
  className?: string;
  listClassName?: string;
};

export function SearchFilterBar({
  value,
  placeholder,
  onDebouncedChange,
  className,
  listClassName,
}: SearchFilterBarProps) {
  return (
    <ListFilterBar className={listClassName}>
      <DebouncedSearchInput
        placeholder={placeholder}
        value={value}
        onDebouncedChange={onDebouncedChange}
        className={className}
      />
    </ListFilterBar>
  );
}
