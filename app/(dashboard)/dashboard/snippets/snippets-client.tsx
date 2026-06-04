"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Check,
  Code2,
  Copy,
  Edit2,
  Pin,
  Plus,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SnippetDialog } from "@/components/layout/snippet-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search title, content, tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
            <Card key={snippet.id} size="sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">{snippet.title}</CardTitle>
                  {snippet.isPinned ? (
                    <Pin className="size-4 shrink-0 text-primary" />
                  ) : null}
                </div>
                <Badge variant="outline">{snippet.language}</Badge>
              </CardHeader>
              <CardContent>
                <pre className="max-h-28 overflow-hidden rounded-md border bg-muted/40 p-2 font-mono text-[11px] leading-relaxed">
                  {snippet.content}
                </pre>
                {snippet.tags && snippet.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(snippet.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => copy(snippet.id, snippet.content)}
                  >
                    {copiedId === snippet.id ? <Check /> : <Copy />}
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(snippet);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit2 />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => remove(snippet.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <SnippetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        snippet={editing}
      />
    </div>
  );
}
