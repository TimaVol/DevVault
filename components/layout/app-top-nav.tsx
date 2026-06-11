"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppShellContext } from "@/hooks/use-app-shell";
import { getRouteTitle } from "@/shared/dashboard-nav";
import { getUserInitial } from "@/shared/user-display";

type AppTopNavProps = {
  userEmail: string | null;
};

export function AppTopNav({ userEmail }: AppTopNavProps) {
  const pathname = usePathname();
  const { title, actions, setMobileNavOpen } = useAppShellContext();
  const displayTitle = title ?? getRouteTitle(pathname) ?? "DevVault";

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
        <h1 className="text-headline-sm truncate font-semibold">{displayTitle}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {actions}
        {userEmail ? (
          <Avatar className="size-8 rounded-full border border-border">
            <AvatarFallback className="rounded-full bg-muted text-xs">
              {getUserInitial(userEmail)}
            </AvatarFallback>
          </Avatar>
        ) : null}
      </div>
    </header>
  );
}
