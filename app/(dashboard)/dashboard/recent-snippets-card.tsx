import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Snippet = {
  id: string;
  title: string;
  language: string;
};

export function RecentSnippetsCard({ snippets }: { snippets: Snippet[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Recent snippets</CardTitle>
          <CardDescription>Latest code fragments</CardDescription>
        </div>
        <Link
          href={ROUTES.snippets}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          View all
          <ArrowUpRight data-icon="inline-end" />
        </Link>
      </CardHeader>
      <CardContent>
        {snippets.length > 0 ? (
          <ul className="divide-y">
            {snippets.map((snippet) => (
              <li
                key={snippet.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{snippet.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {snippet.language}
                  </p>
                </div>
                <Link
                  href={`${ROUTES.snippets}?id=${snippet.id}`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  )}
                >
                  <ArrowUpRight />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty className="border-none p-0">
            <EmptyHeader>
              <EmptyTitle>No snippets yet</EmptyTitle>
              <EmptyDescription>
                Save your first reusable fragment.
              </EmptyDescription>
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
      </CardContent>
    </Card>
  );
}
