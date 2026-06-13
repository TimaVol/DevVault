"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { ListEmptyState } from "@/components/shared/list-empty-state";
import { SnippetPreviewCard } from "@/features/dashboard/components/snippet-preview-card";
import { buttonVariants } from "@/components/ui/button";
import type { DashboardOverview } from "@/features/dashboard/types";
import { useClipboard } from "@/hooks/use-clipboard";
import { ROUTES } from "@/shared/routes";
import { cn } from "@/utils/cn";

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
            <SnippetPreviewCard
              key={snippet.id}
              id={snippet.id}
              title={snippet.title}
              language={snippet.language}
              content={snippet.content}
              copiedId={copiedId}
              onCopy={copy}
            />
          ))}
        </div>
      ) : (
        <ListEmptyState
          title="No snippets yet"
          description="Save your first reusable fragment."
          action={
            <Link
              href={ROUTES.snippets}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Create snippet
            </Link>
          }
        />
      )}
    </div>
  );
}
