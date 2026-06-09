"use client";

import { Input } from "@/components/ui/input";

type ChecklistsFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function ChecklistsFilterBar({
  search,
  onSearchChange,
}: ChecklistsFilterBarProps) {
  return (
    <Input
      placeholder="Search checklists…"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="sm:max-w-xs"
    />
  );
}
