"use client";

import { useState } from "react";
import { Code2, Plus } from "lucide-react";
import { ListPagination } from "@/components/layout/list-pagination";
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

const SNIPPET_FILTER_DEFAULTS = { q: "", lang: "all", page: "1" };

type SnippetsClientProps = {
  initialSnippets: Snippet[];
  languages: string[];
  pagination: { total: number; page: number; pageSize: number };
};

export function SnippetsClient({
  initialSnippets,
  languages,
  pagination,
}: SnippetsClientProps) {
  const [filters, setFilter] = useUrlFilters({ defaults: SNIPPET_FILTER_DEFAULTS });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Snippet | null>(null);
  const { copy, copiedId } = useClipboard();
  const { confirmDelete } = useConfirmDelete();

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
        onSearchChange={(value) => {
          setFilter("q", value);
          setFilter("page", "1");
        }}
        onLanguageChange={(value) => {
          setFilter("lang", value);
          setFilter("page", "1");
        }}
      />

      {initialSnippets.length === 0 ? (
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
          {initialSnippets.map((snippet) => (
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

      <ListPagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onPageChange={(page) => setFilter("page", String(page))}
      />

      <SnippetDialog
        key={editing?.id ?? "new"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        snippet={editing}
      />
    </div>
  );
}
