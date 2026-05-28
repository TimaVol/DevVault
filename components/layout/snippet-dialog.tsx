"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSnippet, updateSnippet } from "@/app/(dashboard)/dashboard/snippets/actions";
import { getErrorMessage } from "@/utils/errors";

interface SnippetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  snippet?: any; // If passed, we are in Edit Mode
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "bash", label: "Bash/Shell" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "plaintext", label: "Plaintext" },
];

export function SnippetDialog({ isOpen, onClose, snippet }: SnippetDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [tagsInput, setTagsInput] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title || "");
      setContent(snippet.content || "");
      setLanguage(snippet.language || "javascript");
      setTagsInput(snippet.tags ? snippet.tags.join(", ") : "");
      setIsPinned(snippet.isPinned || false);
    } else {
      setTitle("");
      setContent("");
      setLanguage("javascript");
      setTagsInput("");
      setIsPinned(false);
    }
  }, [snippet, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setIsLoading(true);

    try {
      if (snippet) {
        // Update mode
        const res = await updateSnippet(snippet.id, {
          title,
          content,
          language,
          tags: tagsArray,
          isPinned,
        });

        if (res.success) {
          toast.success("Snippet updated successfully!");
          onClose();
        } else {
          toast.error(res.error || "Failed to update snippet");
        }
      } else {
        // Create mode
        const res = await createSnippet({
          title,
          content,
          language,
          tags: tagsArray,
          isPinned,
        });

        if (res.success) {
          toast.success("Snippet created successfully!");
          onClose();
        } else {
          toast.error(res.error || "Failed to create snippet");
        }
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-lg border border-border-subtle bg-surface-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              {snippet ? "Edit Code Snippet" : "Create New Snippet"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Store reusable code bits with easy syntax tags
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-sm cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Title <span className="text-primary">*</span>
              </label>
              <Input
                placeholder="e.g. Supabase Server Client Initializer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-input/50 border-border-subtle text-sm h-10"
              />
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Syntax / Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-md border border-border-subtle bg-input/50 px-3 h-10 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-surface-card">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pinned toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Workspace Pin status
              </label>
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`w-full flex items-center justify-between rounded-md border px-3 h-10 text-sm font-medium transition-colors cursor-pointer ${
                  isPinned
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-border-subtle bg-input/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Pin className={`h-4 w-4 ${isPinned ? "fill-primary" : ""}`} />
                  {isPinned ? "Pinned Snippet" : "Unpinned Snippet"}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider">
                  {isPinned ? "Active" : "Off"}
                </span>
              </button>
            </div>

            {/* Tags */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tags (Comma-separated)
              </label>
              <Input
                placeholder="e.g. auth, supabase, utils, backend"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="bg-input/50 border-border-subtle text-sm h-10"
              />
            </div>

            {/* Content (Textarea) */}
            <div className="space-y-1.5 sm:col-span-2 flex-1 flex flex-col">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Code Content <span className="text-primary">*</span>
              </label>
              <textarea
                placeholder="// Write your code snippet here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full flex-1 min-h-[220px] rounded-md border border-border-subtle bg-input/50 p-4 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-border-subtle pt-4 mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-container text-primary-foreground font-semibold cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : snippet ? (
                "Save Changes"
              ) : (
                "Create Snippet"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
