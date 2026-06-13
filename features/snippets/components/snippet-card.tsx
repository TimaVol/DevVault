"use client";

import { Check, Copy, Pin } from "lucide-react";
import { CardEditDeleteActions } from "@/components/shared/card-edit-delete-actions";
import { CodePreview } from "@/components/shared/code-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Snippet } from "@/features/snippets/types";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/format-date";

type SnippetRowProps = {
  snippet: Snippet;
  copiedId: string | null;
  onCopy: (id: string, content: string) => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
};

function SnippetTitle({ snippet }: { snippet: Snippet }) {
  return (
    <div className="flex items-center gap-2">
      <span className="truncate font-medium">{snippet.title}</span>
      {snippet.isPinned ? <Pin className="size-3.5 shrink-0 text-primary" /> : null}
    </div>
  );
}

function SnippetTags({
  tags,
  maxTags,
  emptyFallback,
}: {
  tags?: string[];
  maxTags?: number;
  emptyFallback?: React.ReactNode;
}) {
  const displayTags = maxTags ? tags?.slice(0, maxTags) : tags;

  if (!displayTags?.length) {
    return emptyFallback ?? null;
  }

  return (
    <>
      {displayTags.map((tag) => (
        <Badge key={tag} variant="outline" className="normal-case">
          {tag}
        </Badge>
      ))}
    </>
  );
}

function SnippetRowActions({
  snippet,
  copiedId,
  onCopy,
  onEdit,
  onDelete,
  className,
}: SnippetRowProps & { className?: string }) {
  return (
    <div className={cn("flex gap-1", className)}>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => onCopy(snippet.id, snippet.content)}
      >
        {copiedId === snippet.id ? <Check /> : <Copy />}
      </Button>
      <CardEditDeleteActions
        onEdit={() => onEdit(snippet)}
        onDelete={() => onDelete(snippet.id)}
      />
    </div>
  );
}

export function SnippetMobileCard({
  snippet,
  copiedId,
  onCopy,
  onEdit,
  onDelete,
}: SnippetRowProps) {
  return (
    <div className="tonal-card space-y-3 p-4">
      <SnippetTitle snippet={snippet} />
      <CodePreview
        content={snippet.content}
        className="max-h-16 p-2 text-[10px]"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{snippet.language}</Badge>
        <SnippetTags tags={snippet.tags} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-label-mono text-muted-foreground">
          {formatDate(snippet.createdAt)}
        </span>
        <SnippetRowActions
          snippet={snippet}
          copiedId={copiedId}
          onCopy={onCopy}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

export function SnippetTableRow({
  snippet,
  copiedId,
  onCopy,
  onEdit,
  onDelete,
}: SnippetRowProps) {
  return (
    <TableRow>
      <TableCell>
        <SnippetTitle snippet={snippet} />
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="normal-case">
          {snippet.language}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          <SnippetTags
            tags={snippet.tags}
            maxTags={3}
            emptyFallback={<span className="text-muted-foreground">—</span>}
          />
        </div>
      </TableCell>
      <TableCell className="text-label-mono text-muted-foreground">
        {formatDate(snippet.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <SnippetRowActions
          snippet={snippet}
          copiedId={copiedId}
          onCopy={onCopy}
          onEdit={onEdit}
          onDelete={onDelete}
          className="justify-end"
        />
      </TableCell>
    </TableRow>
  );
}

export function SnippetsTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
