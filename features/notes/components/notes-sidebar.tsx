"use client";

import { Pin, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/cn";
import type { Note } from "@/features/notes/types";

type NotesSidebarProps = {
  notes: Note[];
  searchQuery: string;
  activeNoteId: string | null;
  onSearchChange: (value: string) => void;
  onSelectNote: (id: string) => void;
};

export function NotesSidebar({
  notes,
  searchQuery,
  activeNoteId,
  onSearchChange,
  onSelectNote,
}: NotesSidebarProps) {
  return (
    <Card className="flex w-full shrink-0 flex-col md:w-72">
      <CardHeader className="pb-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <ScrollArea className="h-[420px] pr-2">
          {notes.length > 0 ? (
            <ul className="space-y-1">
              {notes.map((note) => (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => onSelectNote(note.id)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                      activeNoteId === note.id
                        ? "border-border bg-muted"
                        : "border-transparent hover:bg-muted/60",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-medium">{note.title}</p>
                      {note.isPinned ? (
                        <Pin className="size-3.5 shrink-0 fill-primary text-primary" />
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
