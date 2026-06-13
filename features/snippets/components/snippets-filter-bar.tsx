"use client";

import { DebouncedSearchInput } from "@/components/shared/debounced-search-input";
import { ListFilterBar } from "@/components/shared/list-filter-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/features/snippets/constants";

type SnippetsFilterBarProps = {
  search: string;
  language: string;
  onDebouncedSearchChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
};

export function SnippetsFilterBar({
  search,
  language,
  onDebouncedSearchChange,
  onLanguageChange,
}: SnippetsFilterBarProps) {
  return (
    <ListFilterBar className="sm:justify-start">
      <DebouncedSearchInput
        placeholder="Search title, content, tags…"
        value={search}
        onDebouncedChange={onDebouncedSearchChange}
        className="flex-1"
      />
      <Select value={language} onValueChange={(v) => v && onLanguageChange(v)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All languages</SelectItem>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ListFilterBar>
  );
}
