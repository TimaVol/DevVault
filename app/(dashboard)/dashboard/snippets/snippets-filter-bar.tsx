"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SnippetsFilterBarProps = {
  search: string;
  language: string;
  languages: string[];
  onSearchChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
};

export function SnippetsFilterBar({
  search,
  language,
  languages,
  onSearchChange,
  onLanguageChange,
}: SnippetsFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="Search title, content, tags…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Select value={language} onValueChange={(v) => v && onLanguageChange(v)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All languages</SelectItem>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
