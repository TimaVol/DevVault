"use client";

import { Code2 } from "lucide-react";
import { EntityListLayout } from "@/components/shared/entity-list-layout";
import { useClipboard } from "@/hooks/use-clipboard";
import { useEntityListPage } from "@/hooks/use-entity-list-page";
import { useShellCreateAction } from "@/hooks/use-shell-create-action";
import type { PaginationMeta } from "@/server/pagination";
import { deleteSnippet } from "@/features/snippets/server/actions";
import type { Snippet } from "@/features/snippets/types";
import { SnippetMobileCard, SnippetTableRow, SnippetsTable } from "./snippet-card";
import { SnippetDialog } from "./snippet-dialog";
import { SnippetsFilterBar } from "./snippets-filter-bar";

const SNIPPET_FILTER_DEFAULTS = { q: "", lang: "all", page: "1" };

type SnippetsClientProps = {
  initialSnippets: Snippet[];
  languages: string[];
  pagination: PaginationMeta;
};

export function SnippetsClient({
  initialSnippets,
  languages,
  pagination,
}: SnippetsClientProps) {
  const {
    filters,
    setFilter,
    open,
    setOpen,
    entity: editing,
    openCreate,
    openEdit,
    dialogKey,
    remove,
  } = useEntityListPage<Snippet>({
    filterDefaults: SNIPPET_FILTER_DEFAULTS,
    onDelete: deleteSnippet,
    deleteMessage: "Delete this snippet?",
    deleteSuccessMessage: "Snippet deleted",
  });
  const { copy, copiedId } = useClipboard();

  useShellCreateAction("New Snippet", openCreate);

  return (
    <>
      <EntityListLayout
        filterBar={
          <SnippetsFilterBar
            search={filters.q}
            language={filters.lang}
            languages={languages}
            onDebouncedSearchChange={(value) => setFilter("q", value, { resetPage: true })}
            onLanguageChange={(value) => setFilter("lang", value, { resetPage: true })}
          />
        }
        isEmpty={initialSnippets.length === 0}
        emptyState={{
          icon: Code2,
          title: "No snippets yet",
          description: "Save reusable code blocks, CLI commands, or configuration templates.",
          actionLabel: "Create New Snippet",
        }}
        onCreate={openCreate}
        pagination={pagination}
        onPageChange={(page) => setFilter("page", String(page))}
      >
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
      </EntityListLayout>

      <SnippetDialog
        key={dialogKey}
        open={open}
        onOpenChange={setOpen}
        entity={editing}
      />
    </>
  );
}
