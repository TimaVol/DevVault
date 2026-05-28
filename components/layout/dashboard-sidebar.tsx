"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  Code2,
  FolderKanban,
  LayoutDashboard,
  StickyNote,
  User,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/snippets", label: "Snippets", icon: Code2 },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/tools", label: "Tools", icon: Wrench },
  { href: "/dashboard/checklists", label: "Checklists", icon: CheckSquare },
  { href: "/dashboard/notes", label: "Notes", icon: StickyNote },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-4 border-r border-border-subtle bg-surface-container-lowest p-4 md:flex justify-between">
      <div className="flex flex-col gap-4">
        <div className="mb-2 px-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-xs font-bold text-primary-foreground shadow-sm">
              DV
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-foreground">
                DevVault
              </p>
              <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                Workspace
              </p>
            </div>
          </Link>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 border border-transparent",
                  isActive
                    ? "bg-accent border-border-subtle text-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {userEmail && (
        <div className="flex items-center gap-3 border-t border-border-subtle pt-4 px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent border border-border-subtle text-muted-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">
              Developer Workspace
            </p>
            <p className="text-[10px] text-muted-foreground truncate" title={userEmail}>
              {userEmail}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
