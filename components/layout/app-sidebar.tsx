"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Zap } from "lucide-react";
import { signOut } from "@/features/auth/server/actions";
import { useAppShellContext } from "@/hooks/use-app-shell";
import { DASHBOARD_NAV, isNavActive } from "@/shared/dashboard-nav";
import { getUserDisplayName, getUserInitial } from "@/shared/user-display";
import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
      {DASHBOARD_NAV.map((item) => {
        const Icon = item.icon;
        const active = isNavActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "border-l-2 border-primary bg-sidebar-accent font-medium text-primary"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
          >
            <Icon className={cn("size-4", active && "text-primary")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SideNavFooter({ userEmail }: { userEmail: string | null }) {
  if (!userEmail) return null;

  return (
    <div className="mt-auto space-y-1 border-t border-sidebar-border p-3">
      <div className="flex items-center gap-3 px-3 py-2">
        <Avatar className="size-8 rounded-md">
          <AvatarFallback className="rounded-md bg-muted text-xs">
            {getUserInitial(userEmail)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium capitalize">
            {getUserDisplayName(userEmail)}
          </p>
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
        </div>
      </div>
      <form action={signOut}>
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start gap-3 px-3"
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </form>
    </div>
  );
}

function SideNavBrand() {
  return (
    <div className="flex items-center gap-2 border-b border-sidebar-border p-4">
      <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Zap className="size-4" />
      </div>
      <div>
        <p className="text-headline-sm font-bold leading-none">DevVault</p>
        <p className="text-label-mono text-muted-foreground">v1.0</p>
      </div>
    </div>
  );
}

function SideNavPanel({
  userEmail,
  onNavigate,
  className,
}: {
  userEmail: string | null;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex h-full w-60 flex-col border-r border-sidebar-border bg-sidebar",
        className,
      )}
    >
      <SideNavBrand />
      <NavLinks onNavigate={onNavigate} />
      <SideNavFooter userEmail={userEmail} />
    </aside>
  );
}

export function AppSideNav({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const { mobileNavOpen, setMobileNavOpen } = useAppShellContext();
  const isFirstRoute = useRef(true);

  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  return (
    <>
      <div className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:z-50">
        <SideNavPanel userEmail={userEmail} />
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-60 gap-0 p-0" showCloseButton={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SideNavPanel
            userEmail={userEmail}
            onNavigate={() => setMobileNavOpen(false)}
            className="w-full border-r-0"
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
