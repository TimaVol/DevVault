"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Check,
  Code2,
  Copy,
  Edit2,
  ExternalLink,
  Filter,
  Pin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/utils/errors";
import { deleteSnippet } from "./actions";
import { SnippetDialog } from "@/components/layout/snippet-dialog";

interface SnippetsClientProps {
  initialSnippets: any[];
}

export function SnippetsClient({ initialSnippets }: SnippetsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<any | null>(null);

  // Extract unique languages present in snippets
  const uniqueLanguages = Array.from(
    new Set(initialSnippets.map((s) => s.language))
  );

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Snippet copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      try {
        const res = await deleteSnippet(id);
        if (res.success) {
          toast.success("Snippet deleted successfully!");
        } else {
          toast.error(res.error || "Failed to delete snippet");
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      }
    }
  };

  const handleEdit = (snippet: any) => {
    setEditingSnippet(snippet);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingSnippet(null);
    setIsDialogOpen(true);
  };

  // Filter snippets
  const filteredSnippets = initialSnippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (snippet.tags &&
        snippet.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesLanguage =
      selectedLanguage === "all" || snippet.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Code Snippets
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Store, view, and search through your reusable fragments of code.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          size="sm"
          className="bg-primary hover:bg-primary-container text-primary-foreground font-semibold flex items-center gap-1.5 cursor-pointer self-start md:self-auto h-9"
        >
          <Plus className="h-4 w-4" /> Add Snippet
        </Button>
      </section>

      {/* Filter and Search actions bar */}
      <section className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-input/50 border-border-subtle text-sm h-10"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="rounded-md border border-border-subtle bg-input/50 px-3 h-10 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer max-w-[160px]"
          >
            <option value="all">All Languages</option>
            {uniqueLanguages.map((lang: any) => (
              <option key={lang} value={lang} className="bg-surface-card">
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSnippets.length > 0 ? (
          filteredSnippets.map((snippet) => (
            <Card
              key={snippet.id}
              className={`relative overflow-hidden transition-all duration-200 border-border-subtle bg-surface-card hover:border-primary/20 ${
                snippet.isPinned ? "ring-1 ring-primary/20 border-primary/20 bg-surface-card" : ""
              }`}
            >
              <CardContent className="p-5 space-y-4">
                {/* Card Title & Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary leading-tight">
                      {snippet.title}
                    </h3>
                    <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                      {snippet.language}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {snippet.isPinned && (
                      <Pin className="h-3.5 w-3.5 text-primary fill-primary" />
                    )}
                  </div>
                </div>

                {/* Snippet body preview */}
                <div className="relative rounded-md bg-background/50 border border-border-subtle p-3 font-mono text-[10px] text-foreground leading-relaxed overflow-hidden h-28 max-h-28">
                  <pre className="overflow-x-auto select-all h-full pr-4">{snippet.content}</pre>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface-card to-transparent pointer-events-none" />
                </div>

                {/* Tags lists */}
                {snippet.tags && snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {snippet.tags.map((tag: string) => (
                      <span
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20 text-primary border border-primary/10 cursor-pointer uppercase transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Row Actions */}
                <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {new Date(snippet.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopy(snippet.id, snippet.content)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Copy Code"
                    >
                      {copiedId === snippet.id ? (
                        <Check className="h-3.5 w-3.5 text-accent-lime" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(snippet)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(snippet.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3 text-center py-16 text-sm text-muted-foreground border border-dashed border-border-subtle rounded-md">
            <Code2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-medium text-foreground">No snippets found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try modifying your search filter or create a new code snippet.
            </p>
            <Button onClick={handleCreate} variant="outline" size="sm" className="mt-4 cursor-pointer">
              Create your first snippet
            </Button>
          </div>
        )}
      </section>

      {/* Snippet Dialog modal */}
      <SnippetDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        snippet={editingSnippet}
      />
    </div>
  );
}
