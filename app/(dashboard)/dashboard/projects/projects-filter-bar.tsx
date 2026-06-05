"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProjectsFilterBarProps = {
  tab: string;
  search: string;
  onTabChange: (value: string) => void;
  onSearchChange: (value: string) => void;
};

export function ProjectsFilterBar({
  tab,
  search,
  onTabChange,
  onSearchChange,
}: ProjectsFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Tabs value={tab} onValueChange={onTabChange}>
        <TabsList>
          {["all", "backlog", "active", "completed"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Input
        placeholder="Search projects…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-xs"
      />
    </div>
  );
}
