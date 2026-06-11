import {
  CheckSquare,
  Code2,
  FolderKanban,
  LayoutDashboard,
  StickyNote,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/shared/routes";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const DASHBOARD_NAV: readonly DashboardNavItem[] = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.snippets, label: "Snippets", icon: Code2 },
  { href: ROUTES.projects, label: "Projects", icon: FolderKanban },
  { href: ROUTES.tools, label: "Tools", icon: Wrench },
  { href: ROUTES.checklists, label: "Checklists", icon: CheckSquare },
  { href: ROUTES.notes, label: "Notes", icon: StickyNote },
] as const;

export function isNavActive(pathname: string, href: string): boolean {
  return (
    pathname === href ||
    (href !== ROUTES.dashboard && pathname.startsWith(href))
  );
}

export function getRouteTitle(pathname: string): string | undefined {
  const match = DASHBOARD_NAV.find((item) => isNavActive(pathname, item.href));
  return match?.label;
}
