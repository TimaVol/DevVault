"use client";

import { AppSideNav } from "@/components/layout/app-sidebar";
import { AppShellProvider } from "@/components/layout/app-shell-context";
import { AppTopNav } from "@/components/layout/app-top-nav";
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
      <AppShellProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <AppSideNav userEmail={userEmail} />
          <div className="flex min-w-0 flex-1 flex-col md:ml-60">
            <AppTopNav userEmail={userEmail} />
            <main className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </AppShellProvider>
    </ConfirmDeleteProvider>
  );
}
