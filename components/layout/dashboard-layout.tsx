"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/lib/routes";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ConfirmDeleteProvider } from "@/hooks/use-confirm-delete";

export function DashboardLayout({
  userEmail,
  children,
}: {
  userEmail: string | null;
  children: React.ReactNode;
}) {
  return (
    <ConfirmDeleteProvider>
    <SidebarProvider>
      <AppSidebar userEmail={userEmail} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-end gap-2">
            <Link
              href={ROUTES.snippets}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus data-icon="inline-start" />
              New snippet
            </Link>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
    </ConfirmDeleteProvider>
  );
}
