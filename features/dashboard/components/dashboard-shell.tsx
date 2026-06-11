"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAppShell } from "@/components/layout/app-shell-context";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/shared/routes";
import { cn } from "@/utils/cn";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const shellActions = useMemo(
    () => (
      <Link href={ROUTES.snippets} className={cn(buttonVariants({ size: "sm" }))}>
        <Plus data-icon="inline-start" />
        New Snippet
      </Link>
    ),
    [],
  );

  useAppShell({ actions: shellActions });

  return <>{children}</>;
}
