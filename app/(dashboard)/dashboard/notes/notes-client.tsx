"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Edit,
  Eye,
  Loader2,
  Pin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/utils/errors";
import { createNote, deleteNote, updateNote } from "./actions";

interface NotesClientProps {
  initialNotes: any[];
}

export function NotesClient({ initialNotes }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    initialNotes.length > 0 ? initialNotes[0].id : null
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Active note states
  const activeNote = initialNotes.find((n) => n.id === activeNoteId);

  // Local active fields
  const [title, setTitle] = useState(activeNote?.title || "");
  const [content, setContent] = useState(activeNote?.content || "");
  const [isPinned, setIsPinned] = useState(activeNote?.isPinned || false);

  // Sync state when active note changes
  React.useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setIsPinned(activeNote.isPinned);
    } else {
      setTitle("");
      setContent("");
      setIsPinned(false);
    }
  }, [activeNoteId]);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const res = await createNote({
        title: "Untitled Note",
        content: "Write down your daily dev log or technical task description...",
        isPinned: false,
      });

      if (res.success && res.note) {
        toast.success("New note created!");
        setActiveNoteId(res.note.id);
      } else {
        toast.error("Failed to create note");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!activeNoteId) return;
    if (!title.trim()) {
      toast.error("Note title is required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateNote(activeNoteId, {
        title,
        content,
        isPinned,
      });

      if (res.success) {
        toast.success("Note saved successfully!");
      } else {
        toast.error(res.error || "Failed to save note");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activeNoteId) return;
    if (window.confirm("Are you sure you want to delete this note?")) {
      setIsLoading(true);
      try {
        const res = await deleteNote(activeNoteId);
        if (res.success) {
          toast.success("Note deleted successfully!");
          const remaining = initialNotes.filter((n) => n.id !== activeNoteId);
          setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
        } else {
          toast.error(res.error || "Failed to delete note");
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Filter lists
  const filteredNotes = initialNotes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting: Pinned notes at the top
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6 shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Dev Notes & logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Maintain daily diaries, draft technical design logs, and pin critical notes.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          size="sm"
          disabled={isLoading}
          className="bg-primary hover:bg-primary-container text-primary-foreground font-semibold flex items-center gap-1.5 cursor-pointer self-start md:self-auto h-9"
        >
          <Plus className="h-4 w-4" /> New Note
        </Button>
      </section>

      {/* Main Workspace: Split-pane layout */}
      <section className="flex flex-col md:flex-row gap-6 items-stretch min-h-[500px]">
        {/* Left Side: Notes list sidebar */}
        <aside className="w-full md:w-80 shrink-0 border border-border-subtle bg-surface-card rounded-lg p-3 flex flex-col gap-3 max-h-[600px]">
          <div className="relative shrink-0">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-input/50 border-border-subtle text-xs h-9"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
            {sortedNotes.length > 0 ? (
              sortedNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`w-full rounded-md p-3 text-left transition-all border text-xs cursor-pointer flex justify-between gap-2 ${
                    activeNoteId === note.id
                      ? "bg-accent border-border-subtle text-foreground font-bold shadow-sm"
                      : "border-transparent text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-semibold truncate text-foreground">{note.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate leading-relaxed">
                      {note.content.substring(0, 48)}...
                    </p>
                  </div>
                  {note.isPinned && (
                    <Pin className="h-3 w-3 text-primary shrink-0 fill-primary mt-0.5" />
                  )}
                </button>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic text-center py-6">No notes found</p>
            )}
          </div>
        </aside>

        {/* Right Side: Active Editor */}
        <div className="flex-1 min-w-0 border border-border-subtle bg-surface-card rounded-lg p-5 flex flex-col justify-between max-h-[600px]">
          {activeNoteId ? (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* Note actions toolbar */}
              <div className="flex justify-between items-center border-b border-border-subtle pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPreview(!isPreview)}
                    className="border-border-subtle hover:bg-accent text-xs h-8 cursor-pointer flex items-center gap-1.5"
                  >
                    {isPreview ? (
                      <>
                        <Edit className="h-3.5 w-3.5" /> Editor
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </>
                    )}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setIsPinned(!isPinned)}
                    className={`flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isPinned
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "border-border-subtle bg-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Pin className={`h-3.5 w-3.5 ${isPinned ? "fill-primary" : ""}`} />
                    Pinned
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    size="sm"
                    className="bg-primary hover:bg-primary-container text-primary-foreground font-semibold h-8 text-xs cursor-pointer flex items-center gap-1"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>

              {/* Title & Body */}
              <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                <input
                  type="text"
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-lg font-bold font-display border-0 focus:outline-none focus:ring-0 bg-transparent text-foreground placeholder-muted-foreground tracking-tight shrink-0 pb-1"
                  readOnly={isPreview}
                />
                
                {isPreview ? (
                  <div className="flex-1 w-full overflow-y-auto p-4 rounded-md border border-border-subtle bg-background/30 font-sans text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {content || <span className="italic text-muted-foreground">// Empty note body</span>}
                  </div>
                ) : (
                  <textarea
                    placeholder="Start typing your markdown log or tasks here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full flex-1 rounded-md border border-border-subtle bg-input/50 p-4 font-sans text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none overflow-y-auto"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 text-muted-foreground/20 mb-3 animate-pulse" />
              <p className="font-semibold text-foreground">No note active</p>
              <p className="text-xs text-muted-foreground mt-1">Select a diary entry or create a new notes workspace.</p>
              <Button onClick={handleCreate} className="mt-4 bg-primary hover:bg-primary-container text-primary-foreground font-semibold cursor-pointer">
                Create new note
              </Button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
