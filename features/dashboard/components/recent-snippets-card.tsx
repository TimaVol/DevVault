"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Clock3, Copy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import type { DashboardOverview } from "@/features/dashboard/types";
import { useClipboard } from "@/hooks/use-clipboard";
import { ROUTES } from "@/shared/routes";
import { cn } from "@/utils/cn";

function SnippetPreview({
  snippet,
  copiedId,
  onCopy,
}: {
  snippet: DashboardOverview["recentSnippets"][number];
  copiedId: string | null;
  onCopy: (id: string, content: string) => void;
}) {
  return (
    <div className="tonal-card flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="normal-case">
          {snippet.language}
        </Badge>
      </div>
      <h4 className="truncate text-sm font-medium">{snippet.title}</h4>
      <pre className="max-h-24 overflow-hidden rounded border border-border bg-[#0e0e0e] p-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
        {snippet.content}
      </pre>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-2">
        <span className="text-label-caps text-muted-foreground">
          {snippet.language.toUpperCase()}
        </span>
        <button
          type="button"
          onClick={() => onCopy(snippet.id, snippet.content)}
          className="text-muted-foreground transition-colors hover:text-primary"
          aria-label="Copy snippet"
        >
          {copiedId === snippet.id ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export function RecentSnippetsCard({
  snippets,
}: {
  snippets: DashboardOverview["recentSnippets"];
}) {
  const { copy, copiedId } = useClipboard();

  return (
    <div className="flex flex-col gap-4 lg:col-span-8">
      <div className="flex items-center justify-between">
        <h3 className="text-headline-sm flex items-center gap-2 font-semibold">
          <Clock3 className="size-5 text-primary" />
          Recent Snippets
        </h3>
        <Link
          href={ROUTES.snippets}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-primary")}
        >
          View all
          <ArrowUpRight data-icon="inline-end" />
        </Link>
      </div>

      {snippets.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {snippets.slice(0, 4).map((snippet) => (
            <SnippetPreview
              key={snippet.id}
              snippet={snippet}
              copiedId={copiedId}
              onCopy={copy}
            />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No snippets yet</EmptyTitle>
            <EmptyDescription>Save your first reusable fragment.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href={ROUTES.snippets}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Create snippet
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
