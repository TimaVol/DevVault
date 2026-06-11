"use client";

import { Pin, Search } from "lucide-react";
import { DebouncedSearchInput } from "@/components/shared/debounced-search-input";
import { ListPagination } from "@/components/shared/list-pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/cn";
import type { PaginationMeta } from "@/server/pagination";
import type { Note } from "@/features/notes/types";

type NotesSidebarProps = {
  notes: Note[];
  searchQuery: string;
  activeNoteId: string | null;
  pagination: PaginationMeta;
  onDebouncedSearchChange: (value: string) => void;
  onSelectNote: (id: string) => void;
  onPageChange: (page: number) => void;
};

export function NotesSidebar({
  notes,
  searchQuery,
  activeNoteId,
  pagination,
  onDebouncedSearchChange,
  onSelectNote,
  onPageChange,
}: NotesSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-border bg-[#0e0e0e] md:w-80">
      <div className="border-b border-border p-3">
        <p className="text-label-caps mb-2 pl-1 text-muted-foreground">All Notes</p>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
          <DebouncedSearchInput
            placeholder="Search notes…"
            value={searchQuery}
            onDebouncedChange={onDebouncedSearchChange}
            className="rounded-full pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {notes.length > 0 ? (
            <ul className="space-y-0.5">
              {notes.map((note) => (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => onSelectNote(note.id)}
                    className={cn(
                      "w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                      activeNoteId === note.id
                        ? "border-l-2 border-l-primary bg-muted text-primary"
                        : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-medium">{note.title}</p>
                      {note.isPinned ? (
                        <Pin className="size-3.5 shrink-0 fill-primary text-primary" />
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-xs opacity-70">
                      {note.content.slice(0, 48)}
                      {note.content.length > 48 ? "…" : ""}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No notes match your search.
            </p>
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-border p-3">
        <ListPagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={onPageChange}
        />
      </div>
    </aside>
  );
}
