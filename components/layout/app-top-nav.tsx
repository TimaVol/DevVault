"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppShellContext, useAppShellStore } from "@/components/layout/app-shell-context";
import { ROUTES } from "@/shared/routes";

const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.dashboard]: "Dashboard",
  [ROUTES.snippets]: "Snippets",
  [ROUTES.projects]: "Projects",
  [ROUTES.tools]: "Tools",
  [ROUTES.checklists]: "Checklists",
  [ROUTES.notes]: "Notes",
};

type AppTopNavProps = {
  userEmail: string | null;
};

export function AppTopNav({ userEmail }: AppTopNavProps) {
  const pathname = usePathname();
  const { setMobileNavOpen } = useAppShellContext();
  const shell = useAppShellStore();
  const title = shell.title ?? ROUTE_TITLES[pathname] ?? "DevVault";
  const initial = userEmail?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
        >
          <Menu />
        </Button>
        <h1 className="text-headline-sm truncate font-semibold">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {shell.actions}
        {userEmail ? (
          <Avatar className="size-8 rounded-full border border-border">
            <AvatarFallback className="rounded-full bg-muted text-xs">
              {initial}
            </AvatarFallback>
          </Avatar>
        ) : null}
      </div>
    </header>
  );
}
