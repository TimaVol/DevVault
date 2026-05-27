"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  Code2,
  FolderKanban,
  LayoutDashboard,
  StickyNote,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-4 border-r border-border-subtle bg-surface-container-lowest p-4 md:flex">
      <div className="mb-2 px-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-xs font-bold text-primary-foreground">
            DV
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-primary">
              DevVault
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Developer Workspace
            </p>
          </div>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
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
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
