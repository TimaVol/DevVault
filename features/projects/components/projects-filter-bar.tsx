"use client";

import { DebouncedSearchInput } from "@/components/layout/debounced-search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROJECT_FILTER_TABS } from "@/features/projects/constants";

type ProjectsFilterBarProps = {
  tab: string;
  search: string;
  onTabChange: (value: string) => void;
  onDebouncedSearchChange: (value: string) => void;
};

export function ProjectsFilterBar({
  tab,
  search,
  onTabChange,
  onDebouncedSearchChange,
}: ProjectsFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Tabs value={tab} onValueChange={onTabChange}>
        <TabsList>
          {PROJECT_FILTER_TABS.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <DebouncedSearchInput
        placeholder="Search projects…"
        value={search}
        onDebouncedChange={onDebouncedSearchChange}
        className="sm:max-w-xs"
      />
    </div>
  );
}
