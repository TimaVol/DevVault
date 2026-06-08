"use client";

import { Check, Copy, Edit2, Pin, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Snippet } from "@/features/snippets/types";

type SnippetCardProps = {
  snippet: Snippet;
  copiedId: string | null;
  onCopy: (id: string, content: string) => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
};

export function SnippetCard({ snippet, copiedId, onCopy, onEdit, onDelete }: SnippetCardProps) {
  return (
    <Card size="sm">
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
            onClick={() => onCopy(snippet.id, snippet.content)}
          >
            {copiedId === snippet.id ? <Check /> : <Copy />}
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={() => onEdit(snippet)}>
            <Edit2 />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={() => onDelete(snippet.id)}>
            <Trash2 />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
