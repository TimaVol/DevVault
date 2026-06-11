"use client";

import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

type SnippetCodePreviewProps = {
  content: string;
  className?: string;
};

export function SnippetCodePreview({ content, className }: SnippetCodePreviewProps) {
  return (
    <pre
      className={cn(
        "overflow-hidden rounded-md border border-border bg-[#0e0e0e] font-mono leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {content}
    </pre>
  );
}

type SnippetPreviewCardProps = {
  id: string;
  title: string;
  language: string;
  content: string;
  copiedId: string | null;
  onCopy: (id: string, content: string) => void;
};

export function SnippetPreviewCard({
  id,
  title,
  language,
  content,
  copiedId,
  onCopy,
}: SnippetPreviewCardProps) {
  return (
    <div className="tonal-card flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="normal-case">
          {language}
        </Badge>
      </div>
      <h4 className="truncate text-sm font-medium">{title}</h4>
      <SnippetCodePreview content={content} className="max-h-24 p-2 text-[11px]" />
      <div className="mt-auto flex items-center justify-between border-t border-border pt-2">
        <span className="text-label-caps text-muted-foreground">
          {language.toUpperCase()}
        </span>
        <button
          type="button"
          onClick={() => onCopy(id, content)}
          className="text-muted-foreground transition-colors hover:text-primary"
          aria-label="Copy snippet"
        >
          {copiedId === id ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  );
}
