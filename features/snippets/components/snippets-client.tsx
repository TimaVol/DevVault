"use client";

import { useMemo } from "react";
import { Code2, Plus } from "lucide-react";
import { useAppShell } from "@/components/layout/app-shell-context";
import { ListEmptyState } from "@/components/shared/list-empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
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
  const { open, setOpen, entity: editing, openCreate, openEdit, dialogKey } =
    useEntityDialog<Snippet>();
  const { copy, copiedId } = useClipboard();
  const { confirmDelete } = useConfirmDelete();

  const shellActions = useMemo(
    () => (
      <Button onClick={openCreate} size="sm">
        <Plus data-icon="inline-start" />
        New Snippet
      </Button>
    ),
    [openCreate],
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
        <ListEmptyState
          icon={Code2}
          title="No snippets yet"
          description="Save reusable code blocks, CLI commands, or configuration templates."
          actionLabel="Create New Snippet"
          onAction={openCreate}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 md:hidden">
            {initialSnippets.map((snippet) => (
              <SnippetMobileCard
                key={snippet.id}
                snippet={snippet}
                copiedId={copiedId}
                onCopy={(id, content) => copy(content, id)}
                onEdit={openEdit}
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
                onEdit={openEdit}
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
        key={dialogKey}
        open={open}
        onOpenChange={setOpen}
        snippet={editing}
      />
    </div>
  );
}
