"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Code2, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SnippetDialog } from "@/app/(dashboard)/dashboard/snippets/snippet-dialog";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getErrorMessage } from "@/utils/errors";
import { deleteSnippet } from "./actions";
import { SnippetCard } from "./snippet-card";
import { SnippetsFilterBar } from "./snippets-filter-bar";

type Snippet = {
  id: string;
  title: string;
  content: string;
  language: string;
  tags: string[] | null;
  isPinned: boolean;
  createdAt: Date | string;
};

export function SnippetsClient({ initialSnippets }: { initialSnippets: Snippet[] }) {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Snippet | null>(null);

  const languages = Array.from(new Set(initialSnippets.map((s) => s.language)));

  const filtered = initialSnippets.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.title.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q) ||
      (s.tags?.some((t) => t.toLowerCase().includes(q)) ?? false);
    const matchesLang = language === "all" || s.language === language;
    return matchesSearch && matchesLang;
  });

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this snippet?")) return;
    try {
      const res = await deleteSnippet(id);
      if (res.success) toast.success("Snippet deleted");
      else toast.error(res.error || "Delete failed");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

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
        search={search}
        language={language}
        languages={languages}
        onSearchChange={setSearch}
        onLanguageChange={setLanguage}
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
              onCopy={copy}
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
