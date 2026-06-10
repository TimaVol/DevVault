"use client";

import { useMemo, useState } from "react";
import { Code2, Plus } from "lucide-react";
import { useAppShell } from "@/components/layout/app-shell-context";
import { ListPagination } from "@/components/layout/list-pagination";
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
import { SnippetMobileCard, SnippetTableRow, SnippetsTable } from "./snippet-card";
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

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const shellActions = useMemo(
    () => (
      <Button onClick={openCreate} size="sm">
        <Plus data-icon="inline-start" />
        New Snippet
      </Button>
    ),
    [],
  );

  useAppShell({ title: "Snippets", actions: shellActions });

  const remove = (id: string) =>
    confirmDelete(() => deleteSnippet(id), {
      message: "Delete this snippet?",
      successMessage: "Snippet deleted",
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-headline-md font-display">
          Stored Snippets{" "}
          <span className="text-muted-foreground">({pagination.total})</span>
        </h2>
      </div>

      <SnippetsFilterBar
        search={filters.q}
        language={filters.lang}
        languages={languages}
        onDebouncedSearchChange={(value) => {
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
            <EmptyTitle>No snippets yet</EmptyTitle>
            <EmptyDescription>
              Save reusable code blocks, CLI commands, or configuration templates.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={openCreate}>
              <Plus data-icon="inline-start" />
              Create New Snippet
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div className="flex flex-col gap-3 md:hidden">
            {initialSnippets.map((snippet) => (
              <SnippetMobileCard
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
          <SnippetsTable>
            {initialSnippets.map((snippet) => (
              <SnippetTableRow
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
          </SnippetsTable>
        </>
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
