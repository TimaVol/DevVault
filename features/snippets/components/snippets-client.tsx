"use client";

import { useState } from "react";
import { Code2, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useClipboard } from "@/hooks/use-clipboard";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { deleteSnippet } from "@/features/snippets/server/actions";
import type { Snippet } from "@/features/snippets/types";
import { SnippetCard } from "./snippet-card";
import { SnippetDialog } from "./snippet-dialog";
import { SnippetsFilterBar } from "./snippets-filter-bar";

const SNIPPET_FILTER_DEFAULTS = { q: "", lang: "all" };

export function SnippetsClient({ initialSnippets }: { initialSnippets: Snippet[] }) {
  const [filters, setFilter] = useUrlFilters({ defaults: SNIPPET_FILTER_DEFAULTS });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Snippet | null>(null);
  const { copy, copiedId } = useClipboard();
  const { confirmDelete } = useConfirmDelete();

  const languages = Array.from(new Set(initialSnippets.map((s) => s.language)));

  const filtered = initialSnippets.filter((s) => {
    const q = filters.q.toLowerCase();
    const matchesSearch =
      s.title.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q) ||
      (s.tags?.some((t) => t.toLowerCase().includes(q)) ?? false);
    const matchesLang = filters.lang === "all" || s.language === filters.lang;
    return matchesSearch && matchesLang;
  });

  const remove = (id: string) =>
    confirmDelete(() => deleteSnippet(id), {
      message: "Delete this snippet?",
      successMessage: "Snippet deleted",
    });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Snippets"
        description="Search and manage reusable code fragments."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus data-icon="inline-start" />
            Add snippet
          </Button>
        }
      />

      <SnippetsFilterBar
        search={filters.q}
        language={filters.lang}
        languages={languages}
        onSearchChange={(value) => setFilter("q", value)}
        onLanguageChange={(value) => setFilter("lang", value)}
      />

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Code2 />
            </EmptyMedia>
            <EmptyTitle>No snippets</EmptyTitle>
            <EmptyDescription>
              Adjust filters or create your first snippet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              Create snippet
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              copiedId={copiedId}
              onCopy={(id, content) => copy(content, id)}
              onEdit={(s) => {
                setEditing(s);
                setDialogOpen(true);
              }}
              onDelete={remove}
            />
          ))}
        </div>
      )}

      <SnippetDialog
        key={editing?.id ?? "new"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        snippet={editing}
      />
    </div>
  );
}
