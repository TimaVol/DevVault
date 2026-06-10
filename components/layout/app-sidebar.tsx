"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  Code2,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  StickyNote,
  Wrench,
  Zap,
} from "lucide-react";
import { signOut } from "@/features/auth/server/actions";
import { useAppShellContext } from "@/components/layout/app-shell-context";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.snippets, label: "Snippets", icon: Code2 },
  { href: ROUTES.projects, label: "Projects", icon: FolderKanban },
  { href: ROUTES.tools, label: "Tools", icon: Wrench },
  { href: ROUTES.checklists, label: "Checklists", icon: CheckSquare },
  { href: ROUTES.notes, label: "Notes", icon: StickyNote },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== ROUTES.dashboard && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "border-l-2 border-primary bg-sidebar-accent font-medium text-primary"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
          >
            <Icon className={cn("size-4", isActive && "text-primary")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SideNavFooter({ userEmail }: { userEmail: string | null }) {
  const displayName = userEmail?.split("@")[0] ?? "User";
  const initial = userEmail?.charAt(0).toUpperCase() ?? "U";

  if (!userEmail) return null;

  return (
    <div className="mt-auto space-y-1 border-t border-sidebar-border p-3">
      <div className="flex items-center gap-3 px-3 py-2">
        <Avatar className="size-8 rounded-md">
          <AvatarFallback className="rounded-md bg-muted text-xs">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium capitalize">{displayName}</p>
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

      {/* Close drawer on route change */}
      <RouteChangeCloser pathname={pathname} />
    </>
  );
}

function RouteChangeCloser({ pathname }: { pathname: string }) {
  const { setMobileNavOpen } = useAppShellContext();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  return null;
}
